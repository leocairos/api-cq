import { Router, Request, Response } from 'express';
import { createConnection, getConnection, getRepository } from 'typeorm';

import logger from '@config/logger';
import Sample from '@modules/samples/infra/typeorm/entities/Sample';
import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';

import SampleMethod from '@modules/samples/infra/typeorm/entities/SampleMethod';
import MailProvider from '@shared/services/MailProvider';
import msgSampleUpdated from '@shared/providers/MailTemplate';
import { BCryptHash, remoteIp } from '@shared/services/util';
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

  if (!Number.isInteger(Number(pageSize))) {
    return response.json({
      total: 0,
      page,
      pageSize: 'invalid',
      samples: [],
    });
  }

  const pageSizeValid = pageSize > 1000 ? 1000 : pageSize;

  try {
    await createConnection();
  } catch {
    //
  }

  const ormRepository = getRepository(Sample);

  const total = await ormRepository.count();

  const findSamples = await ormRepository.find({
    order: { updated_at: 'DESC' },
    take: Number(pageSizeValid),
    skip: Number(pageSizeValid) * (Number(page) - 1),
  });

  return response.json({
    total,
    page,
    pageSize: Number(pageSizeValid),
    samples: findSamples,
  });
};

const getFilterByTable = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET getFilterByTable (from ${remoteIp(request)})...`);

  const { fieldTable } = request.query;

  if (fieldTable) {
    try {
      await createConnection();
    } catch {
      //
    }

    const query = `select distinct ${fieldTable} as value from vw_samples_header
    where ${fieldTable} is not null order by ${fieldTable};`;

    try {
      const findAuxiliar = await getConnection().query(query);
      return response.json({
        total: Number(findAuxiliar.length),
        data: findAuxiliar,
      });
    } catch {
      logger.warn(
        `GET getFilterByTable: Query ERROR (from ${remoteIp(request)})...`,
      );
      return response.json({
        data: [],
      });
    }
  }
  return response.json({
    data: [],
  });
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

  const findSample = await ormRepository.findOne({
    where: { id: idSample },
  });

  return response.json(findSample);
};

const getVwSamples = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET samples VW(from ${remoteIp(request)})...`);

  const { page = 1, pageSize = 10 } = request.query;

  if (!Number.isInteger(Number(pageSize))) {
    return response.json({
      total: 0,
      page,
      pageSize: 'invalid',
      samples: [],
    });
  }

  const pageSizeValid = pageSize > 1000 ? 1000 : pageSize;

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
      vsa_execute_data_time,vsa_execute_user, vsa_vsm_updated_at, hash_mail
    FROM
      vw_all_samples vas
      order by updated_at limit ${pageSizeValid}`,
  );

  /* const sampleDetail = findSampleDetail.map(sample => {
    return {
      id: findSampleDetail[0].id,
      takenDateTime: findSampleDetail[0].taken_date_time,
      collectionPoint: findSampleDetail[0].collection_point,
      conclusion: findSampleDetail[0].sample_conclusion,
      status: findSampleDetail[0].sample_status,
      type: findSampleDetail[0].sample_type,
      lote: findSampleDetail[0].lote,
      observation: findSampleDetail[0].observation,
      hashMail: findSampleDetail[0].hash_mail,

      analysis: sampleAnalysis,

      order: sample.analyse_order,
      method: sample.analyse_method,
      analyse: sample.analyse_info,
      conclusion: sample.analyse_conclusion,
      value: sample.analyse_display_value,
      unit: sample.analyse_measurement_unit,


  };
  */

  return response.json({
    total: findSampleDetail.length,
    page,
    pageSize: Number(pageSizeValid),
    samples: findSampleDetail,
  });
};

const getSamplesHeader = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET samplesheader (from ${remoteIp(request)})...`);

  const { page = 1, pageSize = 10, filters, orderby } = request.query;

  if (!Number.isInteger(Number(pageSize))) {
    return response.json({
      total: 0,
      page: Number(page),
      pageSize: 'invalid',
      samples: [],
    });
  }

  const pageSizeValid = pageSize > 1000 ? 1000 : pageSize;

  try {
    await createConnection();
  } catch {
    //
  }

  const findTotal = await getConnection().query(
    `SELECT count(*) total FROM vw_samples_header ${
      filters ? `WHERE ${filters} ` : ``
    }`,
  );

  try {
    const query = `SELECT
        id, identification, updated_at, control_number, number,
        year, sub_number, revision, active, sync_portal,
        received, finalized, published, reviewed, taken_date_time,
        received_time, finalized_time, published_time, reviewed_time,
        current_status_edition_date_time, collection_point,
        sample_conclusion, sample_reason, sample_type, sample_status,
        observation, lote, hash_mail
      FROM
        vw_samples_header
      ${filters ? `WHERE ${filters} ` : ``}
      order by
        ${orderby ? `${orderby} ` : `updated_at desc`}
      limit ${Number(pageSizeValid)} offset ${
      Number(Number(page) - 1) * Number(pageSizeValid)
    }`;

    const findSampleDetail = await getConnection().query(query);

    return response.json({
      total: Number(findTotal[0].total),
      page: Number(page),
      pageSize: Number(pageSizeValid),
      samples: findSampleDetail,
    });
  } catch {
    logger.warn(`GET samplesheader ERROR Query(from ${remoteIp(request)})...`);
    return response.json({
      total: Number(0),
      page: Number(0),
      pageSize: Number(0),
      samples: [],
    });
  }
};

const getSampleToMail = async (idSample: number): Promise<any> => {
  logger.info(`Getting sample detail for mail (Sample ${idSample})...`);

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
      vsa_execute_data_time, vsa_execute_user, vsa_vsm_updated_at, hash_mail
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
      hashMail: findSampleDetail[0].hash_mail,
    };
    return sampleDetail;
  } catch {
    return {};
  }
};

const updateHashMail = async (idSample: number): Promise<void> => {
  const hashProvider = new BCryptHash();
  const sampleDetail = await getSampleToMail(idSample);

  try {
    await createConnection();
  } catch {
    //
  }
  const ormRepository = getRepository(Sample);

  const findSample = await ormRepository.findOne({
    where: { id: idSample },
  });

  if (findSample) {
    findSample.hashMail = await hashProvider.generateHash(
      JSON.stringify(sampleDetail),
    );

    await ormRepository.save(findSample);
  }

  logger.info(`Sample ${idSample}, hashMail updated`);
};

const sendMail = async (idSample: number): Promise<boolean> => {
  const mailProvider = new MailProvider();
  const hashProvider = new BCryptHash();

  const sampleDetail = await getSampleToMail(idSample);
  const hashMailStored = sampleDetail.hasMail;
  delete sampleDetail.hashMail;
  const htmlMessage = msgSampleUpdated(sampleDetail);

  const isFornoMHF =
    sampleDetail.collectionPoint === 'Tubulação de Saída da Peneira PE-5001';

  const hashIsEqual = await hashProvider.compareHash(
    JSON.stringify(sampleDetail),
    hashMailStored || '',
  );

  // Sample with same hash, send mail is not necessary
  if (hashIsEqual) {
    logger.info(
      `Send mail Sample ${idSample} is not necessary, because sample hash is not new...`,
    );
    return false;
  }

  try {
    if (isFornoMHF) {
      await mailProvider.sendMail({
        to: process.env.MAIL_TO_FORNO || '', // 'leonardo@xilolite.com.br',
        subject: `[API-CQ] Atualização da Amostra ${idSample}`,
        html: htmlMessage,
      });
    } else {
      logger.info(
        `Send mail Sample ${idSample} not sent, because sample hash is not from MHF`,
      );
    }

    updateHashMail(idSample);
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

      idSample = findSampleMethod?.sample_id || 0;
    } else {
      idSample = EntityId;
    }

    await samplesController.updateSample(idSample);

    const sendMailEvents = [
      'Método da Amostra - Finalizar',
      'Amostra - Finalizar',
    ];

    if (sendMailEvents.includes(Event)) {
      sendMail(idSample);
    } else {
      updateHashMail(idSample);
      logger.info(
        `Send mail Sample ${idSample} not sent, because sample Event is not in "${sendMailEvents}"`,
      );
    }

    return response.status(200).json({ sample: idSample });
  }

  return response.sendStatus(200);
};

routes.use(ensureAuthenticated);
routes.get('/lastSample', getLastSampleUpdated);
routes.get('/samples', getSamples);
routes.get('/sample', getSampleById);
routes.get('/samplesvw', getVwSamples);
routes.get('/samplesHeader', getSamplesHeader);
routes.get('/filterByTable', getFilterByTable);

routes.post('/mylims/notification', mylimsNotification);

export default routes;
