import { Router, Request, Response } from 'express';
import { createConnection, getRepository } from 'typeorm';

import logger from '@config/logger';
import Sample from '@modules/samples/infra/typeorm/entities/Sample';

import ensureAuthenticated from './ensureAuthenticated';

const routes = Router();

const getLastSampleUpdated = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(
    `GET in lastSampleUpdate (from ${request.connection.remoteAddress})...`,
  );

  try {
    await createConnection();
  } catch {
    //
  }
  const ormRepository = getRepository(Sample);

  const findSample = await ormRepository.find({
    order: { currentStatusEditionDateTime: 'DESC' },
    take: 1,
  });

  return response.json(findSample);
};

const getSamples = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET samples (from ${request.connection.remoteAddress})...`);

  const [page = 1, pageSize = 10] = request.body;

  try {
    await createConnection();
  } catch {
    //
  }

  const ormRepository = getRepository(Sample);

  const total = await ormRepository.count();

  const findSamples = await ormRepository.find({
    order: { currentStatusEditionDateTime: 'DESC' },
    take: pageSize,
    skip: pageSize * (page - 1),
  });

  return response.json({ total, page, samples: findSamples });
};

const mylimsNotification = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(
    `POST in mylims/notification (from ${request.connection.remoteAddress})...`,
  );
  /*
  URI:
    http://empresa.site/api/mylims/notification
    Header:
    x-access-key: a9s8das9d8asdas98d90
    Verb:
    POST
    JSON:
    {
    “Entity”: “Sample”,
    “EntityId”: 1,
    “ReferenceKey”: “L001”,
    “Event”: “Insert”
    }
*/

  const { Entity, EntityId, ReferenceKey, Event } = request.body;

  logger.info({ Entity, EntityId, ReferenceKey, Event });

  return response.json({ Entity, EntityId, ReferenceKey, Event });
};

routes.use(ensureAuthenticated);
routes.get('/lastSample', getLastSampleUpdated);
routes.get('/samples', getSamples);

routes.post('/mylims/notification', mylimsNotification);

export default routes;
