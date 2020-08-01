import { Router } from 'express';

import SamplesController from '../controller/SamplesController';

const samplesRouter = Router();
const samplesController = new SamplesController();

samplesRouter.get('/', samplesController.list);
samplesRouter.get('/:id', samplesController.show);

export default samplesRouter;
