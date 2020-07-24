import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthorized from '@modules/users/infra/http/middlewares/ensureAuthorized';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthorized);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
      role: Joi.string(),
    },
  }),
  profileController.update,
);

export default profileRouter;
