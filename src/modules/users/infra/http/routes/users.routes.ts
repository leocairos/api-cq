import { Router } from 'express';
import multer from 'multer';
// import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAuthorization from '@modules/users/infra/http/middlewares/ensureAuthorization';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

const upload = multer(uploadConfig.multer);

usersRouter.get('/', ensureAuthorization(['admin']), usersController.list);

usersRouter.post(
  '/',
  /* celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      document: Joi.string(),
      birthDate: Joi.date(),
      phone1: Joi.string(),
      phone2: Joi.string(),
    },
  }), */
  usersController.create,
);

usersRouter.put('/', ensureAuthorization(['admin']), usersController.update);

export default usersRouter;
