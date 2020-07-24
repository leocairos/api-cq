import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthorized from '@modules/users/infra/http/middlewares/ensureAuthorized';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', ensureAuthorized(['admin']), usersController.list);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.put('/', ensureAuthorized(['admin']), usersController.update);

export default usersRouter;
