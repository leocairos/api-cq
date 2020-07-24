import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  role: string;
}

const permissionRoleRequired = (roles = ['']) => {
  return (request: Request, response: Response, next: NextFunction): void => {
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
        throw new AppError('Unauthorized by role.', 401);
      }

      return next();
    } catch {
      throw new AppError('Invalid JWT token.', 401);
    }
  };
};

export default permissionRoleRequired;
