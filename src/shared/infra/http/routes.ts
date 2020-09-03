import { Router, Request, Response } from 'express';
import { createConnection, getRepository } from 'typeorm';

import logger from '@config/logger';

import Sample from '@modules/samples/infra/typeorm/entities/Sample';
import apiMYLIMS from '@shared/services/apiMYLIMS';

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

/* const serviceStatus = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`GET in serviceStatus`);

  const myLIMsResponse = await apiMYLIMS.get('/checkConnection');

  const connectedMyLIMS = myLIMsResponse.data === true;

  return response.json({ connectedMyLIMS });
};

routes.get('/serviceStatus', serviceStatus); */

routes.get('/samples', list);

export default routes;
