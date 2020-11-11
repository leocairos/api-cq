import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  role: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('Unauthenticated: JWT token is missing.', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub, role, exp } = decoded as ITokenPayload;
    const user = { id: sub, role };

    if (Math.floor(Date.now() / 1000) > exp) {
      throw new AppError('Token expired');
    }

    request.user = user;

    return next();
  } catch (e) {
    throw new AppError(`Unauthorized: Invalid JWT token.${e.message}`, 401);
  }
}
