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

export default function authorize(roles = []) {
  return [
    (request: Request, response: Response, next: NextFunction) => {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new AppError('JWT token is missing.', 401);
      }

      const [, token] = authHeader.split(' ');

      try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub, role } = decoded as ITokenPayload;
        const user = { id: sub, role };

        request.user = user;

        if (roles && !roles.includes(user.role)) {
          return response
            .status(401)
            .json({ status: 'error', messsage: 'Unauthorized by role.' });
        }

        return next();
      } catch {
        throw new AppError('Invalid JWT token.', 401);
      }
    },
  ];
}
