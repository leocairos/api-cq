import { Router, Request, Response } from 'express';
import { createConnection, getConnection, getRepository } from 'typeorm';

import logger from '@config/logger';
import Sample from '@modules/samples/infra/typeorm/entities/Sample';
import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';

import SampleMethod from '@modules/samples/infra/typeorm/entities/SampleMethod';
import MailProvider from '@shared/services/MailProvider';
import msgSampleUpdated from '@shared/providers/MailTemplate';
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

  const { page = 1, pageSize = 10 } = request.query;

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

  return response.json({ total, page, pageSize, samples: findSamples });
};

const getSampleById = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET sample by Id (from ${request.connection.remoteAddress})...`);

  const { idSample = 0 } = request.query;

  try {
    await createConnection();
  } catch {
    //
  }

  const ormRepository = getRepository(Sample);

  const findSample = await ormRepository.find({
    where: { id: idSample },
  });

  return response.json(findSample);
};

const getVwSamples = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET samples VW(from ${request.connection.remoteAddress})...`);
  console.log(request.query);
  const { page = 1, pageSize = 10, idSample = 0 } = request.query;

  try {
    await createConnection();
  } catch {
    //
  }

  // const ormRepository = getRepository(Sample);

  // const total = await ormRepository.count();

  const findSamplesVw = await getConnection().query(
    `select  * from vw_all_samples vas where id=${idSample}`,
  );

  /* const findSamples = await ormRepository.find({
    order: { currentStatusEditionDateTime: 'DESC' },
    take: pageSize,
    skip: pageSize * (page - 1),
  }); */

  return response.json({
    // total: findSamplesVw.length,
    // page,

    findSamplesVw,
    // samples: findSamples,
  });
};

const getSampleToMail = async (idSample: number): Promise<any> => {
  logger.info(`Getting sample detail for mail...`);

  try {
    await createConnection();
  } catch {
    //
  }

  const findSampleDetail = await getConnection().query(
    `SELECT
	    id, identification, updated_at, control_number,
      number, year, sub_number, revision, active,
      taken_date_time, received_time, finalized_time, published_time, reviewed_time,
      collection_point,  sample_conclusion,
      sample_reason, sample_type, observation, lote,
      current_status_edition_date_time, current_status_user, sample_status,
      analyse_id, analyse_order, analyse_info, analyse_display_value, analyse_measurement_unit,
      analyse_value_float, analyse_reference_method, analyse_method,
      analyse_method_analyse_type, analyse_conclusion, analyse_group, analyse_updated_at,
      vsa_method_type, vsa_service_area, vsa_method_status,
      vsa_edition_data_time, vsa_edition_user, vsa_start_data_time, vsa_start_user,
      vsa_execute_data_time,vsa_execute_user, vsa_vsm_updated_at
    FROM
      vw_all_samples vas
    WHERE
      id=${idSample}`,
  );

  const sampleAnalysis = findSampleDetail.map(sample => {
    return {
      order: sample.analyse_order,
      method: sample.analyse_method,
      analyse: sample.analyse_info,
      conclusion: sample.analyse_conclusion,
      value: sample.analyse_display_value,
      unit: sample.analyse_measurement_unit,
    };
  });

  await Promise.all(sampleAnalysis);

  try {
    const sampleDetail = {
      id: findSampleDetail[0].id,
      // identification: findSampleDetail[0].identification,
      taken_date_time: findSampleDetail[0].taken_date_time,
      collection_point: findSampleDetail[0].collection_point,
      sample_conclusion: findSampleDetail[0].sample_conclusion,
      sample_status: findSampleDetail[0].sample_status,
      sample_type: findSampleDetail[0].sample_type,
      lote: findSampleDetail[0].lote,
      observation: findSampleDetail[0].observation,
      /* updated_at, control_number,
        number, year, sub_number, revision, active,
        taken_date_time, received_time, finalized_time, published_time, reviewed_time,
        collection_point,  sample_conclusion,
        sample_reason, sample_type, observation, lote,
        current_status_edition_date_time, current_status_user, sample_status, */
      analysis: sampleAnalysis,
    };
    return sampleDetail;
  } catch {
    return {};
  }
};

const sendMail = sample => {
  const mailProvider = new MailProvider();

  const htmlMessage = msgSampleUpdated(sample);

  mailProvider.sendMail({
    to: {
      name: 'Leonardo',
      email: 'leonardo@xilolite.com.br',
    },
    subject: `[API-CQ] Atualização da Amostra ${sample.id}`,
    html: htmlMessage,
  });
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

  logger.info(JSON.stringify({ Entity, EntityId, ReferenceKey, Event }));

  let idSample = 0;
  if (Entity === 'Sample' || Entity === 'SampleMethod') {
    const samplesController = new SamplesControllerv2();

    if (Entity === 'SampleMethod') {
      try {
        await createConnection();
      } catch {
        //
      }
      const ormRepository = getRepository(SampleMethod);

      const findSampleMethod = await ormRepository.findOne({
        where: { id: EntityId },
      });

      idSample = findSampleMethod.sample_id;
    } else {
      idSample = EntityId;
    }

    console.log('idSample', idSample);
    await samplesController.updateSample(idSample);
    const sampleDetail = await getSampleToMail(idSample);

    // sendMail(sampleDetail);
    return response.status(200).json(sampleDetail);

    // console.log(JSON.stringify(sampleDetail));
  }

  return response.sendStatus(200);
};

routes.use(ensureAuthenticated);
routes.get('/lastSample', getLastSampleUpdated);
routes.get('/samples', getSamples);
routes.get('/sample', getSampleById);
routes.get('/samplesvw', getVwSamples);

routes.post('/mylims/notification', mylimsNotification);

export default routes;
