import { Router } from 'express';

import samplesRouter from '@modules/samples/infra/http/routes/samples.routes';
import mylimsRouter from '@modules/samples/infra/http/routes/mylims.routes';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

import { serviceStatus, checkTasks } from '../controller/ServerController';

const routes = Router();

routes.get('/serviceStatus', serviceStatus);
// routes.get('/checkTasks', checkTasks);

routes.use('/samples', samplesRouter);
routes.use('/mylims', mylimsRouter);

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
