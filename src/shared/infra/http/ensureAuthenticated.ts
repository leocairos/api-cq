import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';
import logger from '@config/logger';

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const accessKey = request.headers['x-access-key'];
  if (!accessKey) {
    logger.warn(`Token is missing from ${request.connection.remoteAddress}`);
    throw new AppError('Token is missing.', 401);
  }

  if (accessKey === process.env.KEY_ACTIVE_INTEGRATION) {
    return next();
  }
  logger.warn(`Invalid token from ${request.connection.remoteAddress}`);
  throw new AppError('Invalid token.', 401);
}

export default ensureAuthenticated;
