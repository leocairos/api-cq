import { Router } from 'express';

import SamplesController from './SamplesController';

const samplesRouter = Router();
const samplesController = new SamplesController();

samplesRouter.get('/', samplesController.getSamples);

export default samplesRouter;
