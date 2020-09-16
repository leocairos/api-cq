import { Router, Request, Response } from 'express';
import { createConnection, getConnection, getRepository } from 'typeorm';

import logger from '@config/logger';
import Sample from '@modules/samples/infra/typeorm/entities/Sample';
import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';

import SampleMethod from '@modules/samples/infra/typeorm/entities/SampleMethod';
import MailProvider from '@shared/services/MailProvider';
import msgSampleUpdated from '@shared/providers/MailTemplate';
import remoteIp from '@shared/services/util';
import ensureAuthenticated from './ensureAuthenticated';

const routes = Router();

const getLastSampleUpdated = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET in lastSampleUpdate (from ${remoteIp(request)})...`);

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
  logger.info(`GET samples (from ${remoteIp(request)})...`);

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
  logger.info(`GET sample by Id (from ${remoteIp(request)})...`);

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
  logger.info(`GET samples VW(from ${remoteIp(request)})...`);
  // console.log(request.query);
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
      takenDateTime: findSampleDetail[0].taken_date_time,
      collectionPoint: findSampleDetail[0].collection_point,
      conclusion: findSampleDetail[0].sample_conclusion,
      status: findSampleDetail[0].sample_status,
      type: findSampleDetail[0].sample_type,
      lote: findSampleDetail[0].lote,
      observation: findSampleDetail[0].observation,
      analysis: sampleAnalysis,
    };
    return sampleDetail;
  } catch {
    return {};
  }
};

const sendMail = async (idSample: number): Promise<boolean> => {
  const mailProvider = new MailProvider();

  const sampleDetail = await getSampleToMail(idSample);
  const htmlMessage = msgSampleUpdated(sampleDetail);

  const recipients = process.env.MAIL_TO_FORNO || '';

  try {
    await mailProvider.sendMail({
      to: recipients, // 'leonardo@xilolite.com.br',
      subject: `[API-CQ] Atualização da Amostra ${idSample}`,
      html: htmlMessage,
    });
    return true;
  } catch {
    return false;
  }
};

const mylimsNotification = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`POST in mylims/notification (from ${remoteIp(request)})...`);

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

    await samplesController.updateSample(idSample);

    sendMail(idSample);
    return response.status(200).json({ sample: idSample });

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
