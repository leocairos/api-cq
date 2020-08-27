import { Router, Request, Response } from 'express';
import { createConnection, getRepository } from 'typeorm';

import logger from '@config/logger';

import Sample from '@modules/samples/infra/typeorm/entities/Sample';

const routes = Router();

const list = async (request: Request, response: Response): Promise<any> => {
  logger.info(`getting all samples`);
  try {
    await createConnection();
  } catch {
    //
  }
  const ormRepository = getRepository(Sample);

  const findSample = await ormRepository.find({
    order: { currentStatusEditionDateTime: 'DESC' },
    take: 1000,
  });

  return response.json(findSample);
};

routes.get('/samples', list);

export default routes;
