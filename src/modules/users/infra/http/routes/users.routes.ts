import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

// import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAuthorization from '@modules/users/infra/http/middlewares/ensureAuthorization';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

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

usersRouter.put('/', ensureAuthorization(['admin']), usersController.update);

export default usersRouter;
