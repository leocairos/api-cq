import { Router } from 'express';

import SamplesController from '../controller/SamplesController';

const samplesRouter = Router();
const samplesController = new SamplesController();

samplesRouter.get('/', samplesController.list);

export default samplesRouter;
