import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import logger from '@config/logger';
import { remoteIp } from '@shared/services/util';
import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

const google = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`POST in session/google (from ${remoteIp(request)})...`);

  const { Entity, EntityId, ReferenceKey, Event } = request.body;

  logger.info(JSON.stringify({ Entity, EntityId, ReferenceKey, Event }));

  return response.status(200).json({ user: 1 });
};

sessionsRouter.post('/google', google);

export default sessionsRouter;
