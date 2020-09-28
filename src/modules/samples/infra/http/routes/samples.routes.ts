import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAuthorization from '@modules/users/infra/http/middlewares/ensureAuthorization';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const samplesRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

samplesRouter.get('/', ensureAuthorization(['admin']), usersController.list);
samplesRouter.post('/', usersController.create);
samplesRouter.patch(
  '/avatar',
  ensureAuthenticated,
  userAvatarController.update,
);
samplesRouter.put('/', ensureAuthorization(['admin']), usersController.update);

export default samplesRouter;
