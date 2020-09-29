import { Router, Request, Response } from 'express';

import { createConnection, getConnection, getRepository } from 'typeorm';

import logger from '@config/logger';
import Sample from '@modules/samples/infra/typeorm/entities/Sample';

import { remoteIp } from '@shared/services/util';

const samplesRouter = Router();
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

const getSamplesAnalyesBySample = async (
  request: Request,
  response: Response,
): Promise<any> => {
  logger.info(`GET getSamplesAnalyesBySample (from ${remoteIp(request)})...`);

  const { sample_id } = request.params;

  try {
    await createConnection();
  } catch {
    //
  }

  try {
    const query = `
    SELECT
	    sa.sample_id, sa.id, sa."order", sa.display_value, sa.measurement_unit,
      sa.value_float, sa.method_analysis_type, sa.conclusion, sa.created_at,
      sa.updated_at, i2.identification AS analise, vsm.id AS id_sample_method,
      vsm.method, vsm.method_type, vsm.service_area, vsm.method_status
    FROM sample_analyses sa
      LEFT JOIN infos i2 ON sa.info_id = i2.id
      LEFT JOIN vw_samples_methods vsm ON sa.sample_id = vsm.sample_id AND sa.method_id = vsm.method_id
    WHERE sa.sample_id='${sample_id}'
    ORDER BY sa."order"`;

    // console.log(query);
    const findSampleAnalysis = await getConnection().query(query);

    return response.json({
      total: findSampleAnalysis.length,
      samplesAnalysis: findSampleAnalysis,
    });
  } catch {
    logger.warn(
      `GET getSamplesAnalyesBySample ERROR Query(from ${remoteIp(request)})...`,
    );
    return response.json({
      total: 0,
      samplesAnalysis: [],
    });
  }
};

samplesRouter.get('/lastSample', getLastSampleUpdated);
samplesRouter.get('/samples', getSamples);
samplesRouter.get('/sample', getSampleById);
samplesRouter.get('/samplesvw', getVwSamples);
samplesRouter.get('/samplesHeader', getSamplesHeader);
samplesRouter.get('/samples/:sample_id/analysis', getSamplesAnalyesBySample);
samplesRouter.get('/filterByTable', getFilterByTable);

export default samplesRouter;
