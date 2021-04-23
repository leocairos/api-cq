import { Router, Request, Response } from 'express';

import { createConnection, getConnection, getRepository } from 'typeorm';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import logger from '@config/logger';
import Sample from '@modules/samples/infra/typeorm/entities/Sample';
import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';

import SampleMethod from '@modules/samples/infra/typeorm/entities/SampleMethod';
import { remoteIp } from '@shared/services/util';
import { reprocessTasksWithError } from '@shared/infra/http/controller/ServerController';

import ensureKeyAuthorization from '@modules/users/infra/http/middlewares/ensureKeyAuthorization';
import SampleMailNotificationController from '@modules/samples/infra/controller/SampleMailNotificationController';
import { ISampleDetail } from '@modules/samples/dtos/ISampleNotificationDTO';
import md5 from 'md5';
import { format } from 'date-fns';
import sendMailDev from './sendMailDev';

// import sendMailDev from './sendMailDev';

const mylimsRouter = Router();

const getSampleToMail = async (idSample: number): Promise<ISampleDetail> => {
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

  await sampleAnalysis.sort(function (a, b) {
    if (a.analyse > b.analyse) return 1;
    if (a.analyse < b.analyse) return -1;
    return 0;
  });

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
      // lastUpdated_at: new Date(maxDateInSample),
    };
    return sampleDetail;
  } catch {
    return {} as ISampleDetail;
  }
};

const updateHashMail = async (sampleDetail: ISampleDetail): Promise<void> => {
  // const hashProvider = new BCryptHash();

  // eslint-disable-next-line no-param-reassign
  delete sampleDetail?.hashMail;
  // eslint-disable-next-line no-param-reassign
  // delete sampleDetail.lastUpdated_at;
  // eslint-disable-next-line no-param-reassign
  delete sampleDetail.notificationEvent;

  try {
    await createConnection();
  } catch {
    //
  }
  const ormRepository = getRepository(Sample);

  const findSample = await ormRepository.findOne({
    where: { id: sampleDetail.id },
  });

  if (findSample) {
    // findSample.hashMail = await hashProvider.generateHash(
    //   JSON.stringify(sampleDetail),
    // );

    // findSample.hashMail = JSON.stringify(sampleDetail);
    findSample.hashMail = md5(JSON.stringify(sampleDetail));

    await ormRepository.save(findSample);
  }

  logger.info(`Sample ${sampleDetail.id}, hashMail updated`);
};

const sendMail = async (sampleDetail: ISampleDetail): Promise<boolean> => {
  const hashMailStored = sampleDetail.hashMail;

  const isFornoMHF =
    sampleDetail.collectionPoint === 'Tubulação de Saída da Peneira PE-5001';

  const pontosFlotacao = [
    'Elevador de Canecas EC 0005 - Flotação',
    // 'Descarga do Filtro de Mangas - Flotação de Talco - ',
    // 'Descarga do Filtro Horizontal - Flotação de Talco - ',
  ];

  const isFlotacao = pontosFlotacao.includes(
    sampleDetail.collectionPoint || '',
  );

  const sampleDetailParsed = {} as ISampleDetail;

  Object.assign(sampleDetailParsed, sampleDetail);

  // eslint-disable-next-line no-param-reassign
  delete sampleDetailParsed?.hashMail;
  // eslint-disable-next-line no-param-reassign
  // delete sampleDetailParsed.lastUpdated_at;
  // eslint-disable-next-line no-param-reassign
  delete sampleDetailParsed.notificationEvent;

  // eslint-disable-next-line no-param-reassign
  sampleDetailParsed.takenDateTime = sampleDetailParsed.takenDateTime
    ? format(
        sampleDetailParsed.takenDateTime as Date,
        "dd/MM/yyyy 'às' HH:mm'h'",
      )
    : '';

  const newHash = md5(JSON.stringify(sampleDetailParsed));
  const hashIsEqual = newHash === hashMailStored;

  // Sample with same hash, send mail is not necessary
  if (hashIsEqual) {
    logger.info(
      `Send mail Sample ${sampleDetail.id} is not necessary, because sample hash is not new...`,
    );
    return false;
  }

  const statusIgnore = ['Recebida', 'Registrada'].includes(
    sampleDetail.status || '',
  );

  try {
    if (statusIgnore) {
      logger.info(
        `Send mail Sample ${sampleDetail.id} [${sampleDetail.status}] not sent, because Sample has no eligible status`,
      );
      updateHashMail(sampleDetail);
      return true;
    }

    if (isFornoMHF || isFlotacao) {
      const sendSampleMailNotificationController = new SampleMailNotificationController();

      Object.assign(sampleDetail, {
        notificationEvent: `${sampleDetail.notificationEvent}
        | hashMailStored: ${hashMailStored}
        | newHash: ${newHash}
        | hashIsEqual: ${hashIsEqual}`,
      });

      await sendSampleMailNotificationController.create(
        isFornoMHF
          ? `${process.env.MAIL_TO_FORNO}`
          : `${process.env.MAIL_TO_FLOTACAO}`,
        sampleDetail,
      );

      // await sendMailDev({
      //   subject: 'API CQ Dev',
      //   html: `sampleDetail: ${JSON.stringify(sampleDetail)} \n
      //   sampleDetailParsed: ${JSON.stringify(sampleDetailParsed)} \n
      //   hashMailStored: ${hashMailStored} \n
      //   hashIsEqual: ${hashIsEqual} \n
      //   md5(JSON.stringify(sampleDetailParsed)): ${md5(
      //     JSON.stringify(sampleDetailParsed),
      //   )}`,
      // });
    } else {
      logger.info(
        `Send mail Sample ${sampleDetail.id} not sent, because sample hash is not from MHF or Flotação`,
      );
    }

    updateHashMail(sampleDetail);
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

    const samplesController = new SamplesControllerv2();
    await samplesController.updateSample(idSample);
    const sampleDetail = await getSampleToMail(idSample);

    Object.assign(sampleDetail, {
      notificationEvent: `Entity: ${Entity} | Event: ${Event}`,
    });

    // eslint-disable-next-line no-param-reassign
    // sampleDetail.lastUpdated_at = sampleDetail.lastUpdated_at
    //   ? format(sampleDetail.lastUpdated_at as Date, 'dd/MM/yyyy HH:mm:ss')
    //   : '';

    sendMail(sampleDetail);

    return response.status(200).json({ sample: idSample });
  }

  return response.sendStatus(200);
};

const serviceStatus = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`GET in serviceStatus (from ${remoteIp(request)})...`);
  const urlMyLimsTaskbase =
    '/tasks/9/Histories?$inlinecount=allpages&$top=10&$filter=Success eq false';

  const myLIMsResponseConn = await apiMYLIMS.get('/checkConnection');

  const myLIMsResponseTsk = await apiMYLIMS.get(
    `${urlMyLimsTaskbase}&$orderby=CreateDateTime`,
  );

  const connectedMyLIMS = myLIMsResponseConn.data === true;
  const tasksWithError = myLIMsResponseTsk.data.TotalCount;

  if (tasksWithError) {
    const myLIMsResponseTskDesc = await apiMYLIMS.get(
      `${urlMyLimsTaskbase}&$orderby=CreateDateTime desc`,
    );

    const messageOlder = myLIMsResponseTsk.data.Result[0]?.Message;

    const olderTask = {
      id: myLIMsResponseTsk.data.Result[0]?.Id,
      trigger: myLIMsResponseTsk.data.Result[0]?.TaskTrigger?.Identification,
      integration:
        myLIMsResponseTsk.data.Result[0]?.ActiveIntegration?.Identification,
      executionDateTime: myLIMsResponseTsk.data.Result[0]?.Execution,
      createDateTime: myLIMsResponseTsk.data.Result[0]?.CreateDateTime,
      createUser: myLIMsResponseTsk.data.Result[0]?.CreateUser?.Identification,
      attempts: myLIMsResponseTsk.data.Result[0]?.Attempts,
      data: myLIMsResponseTsk.data.Result[0]?.Data,
      message: messageOlder.substring(
        messageOlder.indexOf('<p><b>') + 6,
        messageOlder.indexOf('</p>'),
      ),
    };

    const messageNewest = myLIMsResponseTskDesc.data.Result[0]?.Message;
    const newestTask = {
      id: myLIMsResponseTskDesc.data.Result[0]?.Id,
      trigger:
        myLIMsResponseTskDesc.data.Result[0]?.TaskTrigger?.Identification,
      integration:
        myLIMsResponseTskDesc.data.Result[0]?.ActiveIntegration?.Identification,
      executionDateTime: myLIMsResponseTskDesc.data.Result[0]?.Execution,
      createDateTime: myLIMsResponseTskDesc.data.Result[0]?.CreateDateTime,
      createUser:
        myLIMsResponseTskDesc.data.Result[0]?.CreateUser?.Identification,
      attempts: myLIMsResponseTskDesc.data.Result[0]?.Attempts,
      data: myLIMsResponseTskDesc.data.Result[0]?.Data,
      message: messageNewest.substring(
        messageNewest.indexOf('<p><b>') + 6,
        messageNewest.indexOf('</p>'),
      ),
    };
    return response
      .status(200)
      .json({ connectedMyLIMS, tasksWithError, olderTask, newestTask });
  }
  return response.status(200).json({ connectedMyLIMS, tasksWithError });
};

const reprocessTasksWithErrorControlller = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`POST in reprocessTasksWithError (from ${remoteIp(request)})...`);

  // const urlMyLimsTaskbase =
  //   '/tasks/9/Histories?$inlinecount=allpages&$top=10&$filter=Success eq false';

  // const myLIMsResponseTsk = await apiMYLIMS.get(
  //   `${urlMyLimsTaskbase}&$orderby=CreateDateTime`,
  // );

  // const tasksToReprocess = myLIMsResponseTsk.data.TotalCount;
  // const tasksWithError = myLIMsResponseTsk.data.Result;

  // /*
  //  "Entity": "{\"SampleMethodId\":436378}",
  //  "EntityId": "{\"SampleMethodId\":436378}"
  // */
  // const tasksDetails = tasksWithError.map(task => {
  //   const rawData = task.Data;
  //   const urlToReprocess = `/Tasks/9/Histories/${task.Id}/Execute`;
  //   const parsedTask = {
  //     Id: task.Id,
  //     Event: task.TaskTrigger.Identification,
  //     Entity: rawData.substring(
  //       rawData.indexOf('{') + 2,
  //       rawData.indexOf(':') - 1,
  //     ),
  //     EntityId: Number(
  //       rawData.substring(rawData.indexOf(':') + 1, rawData.indexOf('}')),
  //     ),
  //     urlToReprocess,
  //     // rawData,
  //   };

  //   return parsedTask;
  // });

  // await Promise.all(tasksDetails);
  // // eslint-disable-next-line no-restricted-syntax
  // for (const task of tasksDetails) {
  //   // eslint-disable-next-line no-await-in-loop
  //   // await
  //   apiMYLIMS.get(task.urlToReprocess);
  //   logger.info(`>> reprocessing Task ${task.Id} [${task.Event}]...`);
  // }

  const { tasksToReprocess, tasksDetails } = await reprocessTasksWithError();
  return response.status(200).json({
    tasksToReprocess,
    reprocessing: tasksDetails.length,
    tasksDetails,
  });
};

const mylimsSyncSample = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(
    `PATCH in mylims/mylimsSyncSample (from ${remoteIp(request)})...`,
  );

  const { idSample } = request.params;

  try {
    if (idSample) {
      const samplesController = new SamplesControllerv2();
      await samplesController.updateSample(Number(idSample));
      const sampleDetail = await getSampleToMail(Number(idSample));
      sendMail(sampleDetail);
      return response.status(200).json({ sample: idSample });
    }
    return response.status(400).json({ message: 'idSample is required!' });
  } catch (err) {
    logger.error(`[mylimsSyncSample] Aborted with error: ${err} `);
    return response.sendStatus(400);
  }
};

mylimsRouter.use(ensureKeyAuthorization);

mylimsRouter.get('/status', serviceStatus);

mylimsRouter.post('/notification', mylimsNotification);

mylimsRouter.patch('/syncsample/:idSample', mylimsSyncSample);

mylimsRouter.post(
  '/reprocesstaskswitherror',
  reprocessTasksWithErrorControlller,
);

export default mylimsRouter;
