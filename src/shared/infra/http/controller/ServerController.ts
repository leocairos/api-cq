/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import { CronJob } from 'cron';
// import { Request, Response } from 'express';

import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';
import apiMYLIMS from '@shared/services/apiMYLIMS';
// import apiCQ from '@shared/services/apiCQ';
import AuxiliariesControllerv2 from '@modules/samples/infra/controller/AuxiliariesControllerv2';
import { runMode, appPort } from '@config/runMode';
import logger from '@config/logger';

const importAllSamples = async (): Promise<void> => {
  const samplesController = new SamplesControllerv2();
  await apiMYLIMS
    .get('/samples?$inlinecount=allpages&$top=5')
    .then(async samples => {
      const totalCount = Number(samples.data.TotalCount);

      const top = Number(process.env.COUNT_SINC_AT_TIME);
      let skip = Number(process.env.INTERVAL_SINC_MYLIMS_SKIP || 0);
      let recordsProcesseds = 0;
      const filter = '';
      while (skip < totalCount) {
        // eslint-disable-next-line no-await-in-loop
        const recordsProcNow = await samplesController.update(
          skip,
          top,
          filter,
        );
        skip += top;
        recordsProcesseds += recordsProcNow;
        logger.info(`${recordsProcesseds} records imported (of ${totalCount})`);
      }
      logger.info(`Finished with ${totalCount} imported records`);
    })
    .catch(error => {
      logger.error(`[importAllSamples Get] Aborted with error: ${error}`);
    });
};

const importNews = async (): Promise<void> => {
  const samplesController = new SamplesControllerv2();
  const lastDate = await samplesController.getLastEditionStored();
  lastDate.setHours(
    lastDate.getHours() - Number(process.env.HOUR_TO_RETROCED_IMPORT || 12),
  );
  const formatedDate = lastDate.toISOString();
  const baseURL = '/samples?$inlinecount=allpages&$top=5&$skip=0';
  const filter = `CurrentStatus/EditionDateTime ge DATETIME'${formatedDate}'`;

  await apiMYLIMS
    .get(`${baseURL}&$filter=${filter}`)
    .then(async samples => {
      const totalCount = Number(samples.data.TotalCount);

      logger.info(`${totalCount} records until ${formatedDate}`);

      const top = Number(process.env.COUNT_SINC_AT_TIME);
      let skip = 0;
      let recordsProcesseds = 0;
      while (skip < totalCount) {
        // eslint-disable-next-line no-await-in-loop
        const recordsProcNow = await samplesController.update(
          skip,
          top,
          filter,
        );
        skip += top;
        recordsProcesseds += recordsProcNow;
        logger.info(`${recordsProcesseds} records imported (of ${totalCount})`);
      }
      logger.info(`Finished with ${totalCount} imported records`);
      logger.info(`Waiting next synchronization..`);
    })
    .catch(error => {
      logger.error(`[importNews Get] Aborted with error: ${error}`);
    });
};

interface ITaskDetail {
  Id: number;
  Event: string;
  Entity: string;
  EntityId: number;
  urlToReprocess: string;
}

interface IReprocessResult {
  tasksToReprocess: number;
  tasksDetails: ITaskDetail[];
}

export const reprocessTasksWithError = async (): Promise<IReprocessResult> => {
  logger.info(`Reprocessing Tasks With Error...`);

  const urlMyLimsTaskbase =
    '/tasks/9/Histories?$inlinecount=allpages&$top=10&$filter=Success eq false';

  const myLIMsResponseTsk = await apiMYLIMS.get(
    `${urlMyLimsTaskbase}&$orderby=CreateDateTime desc`,
  );

  const tasksToReprocess = myLIMsResponseTsk.data.TotalCount;
  const tasksWithError = myLIMsResponseTsk.data.Result;

  const tasksDetails = tasksWithError.map(task => {
    const rawData = task.Data;
    const urlToReprocess = `/Tasks/9/Histories/${task.Id}/Execute`;
    const parsedTask = {
      Id: task.Id,
      Event: task.TaskTrigger.Identification,
      Entity: rawData.substring(
        rawData.indexOf('{') + 2,
        rawData.indexOf(':') - 1,
      ),
      EntityId: Number(
        rawData.substring(rawData.indexOf(':') + 1, rawData.indexOf('}')),
      ),
      urlToReprocess,
      // rawData,
    };

    return parsedTask;
  });

  await Promise.all(tasksDetails);

  logger.info(
    `>> Tasks to Reprocess: ${tasksToReprocess} Reprocessing: ${tasksDetails.length}`,
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const task of tasksDetails) {
    await apiMYLIMS
      .get(task.urlToReprocess)
      .then(resCode => {
        logger.info(
          `>> [${resCode.status}] Start reprocessing Task ${task.Id} [${task.Event}]...`,
        );
      })
      .catch(error => {
        logger.error(`[Tasks Reprocess] Aborted with error: ${error} `);
      });
    // await apiCQ.post('/mylims/notification', {
    //   Entity: task.Entity,
    //   EntityId: task.EntityId,
    //   ReferenceKey: 'L001',
    //   Event: task.Event,
    // });
  }

  return { tasksToReprocess, tasksDetails };
};

const runCheck = () => {
  logger.info(
    `Every ${process.env.INTERVAL_TO_IMPORT} seconds check tasks with error...`,
  );

  // eslint-disable-next-line no-case-declarations
  let isRunningRep = false;
  try {
    const job = new CronJob(
      `*/${process.env.INTERVAL_TO_IMPORT} * * * * *`,
      () => {
        if (!isRunningRep) {
          isRunningRep = true;
          setTimeout(async () => {
            await reprocessTasksWithError();
            isRunningRep = false;
          }, 3000);
        }
      },
    );
    job.start();
  } catch (err) {
    logger.error(`Finished with error: ${err}`);
    isRunningRep = false;
  }
};

const serverListen = (): void => {
  logger.info(
    `\n${'#'.repeat(100)}\n${' '.repeat(
      26,
    )} Service now running on port '${appPort()}' (${process.env.NODE_ENV
    }) ${' '.repeat(26)} \n${'#'.repeat(100)}\n`,
  );

  switch (runMode()) {
    case 'importAll':
      logger.info('Import All records');

      try {
        setTimeout(async () => {
          await AuxiliariesControllerv2();
          await importAllSamples();
          process.exit(0);
        }, 3000);
      } catch (err) {
        logger.error(`Finished with error: ${err}`);
        process.exit(1);
      }
      break;

    case 'sync':
      logger.info(
        `Every ${process.env.INTERVAL_TO_IMPORT} seconds importing updated records in the last ${process.env.HOUR_TO_RETROCED_IMPORT} hours`,
      );

      // eslint-disable-next-line no-case-declarations
      let isRunning = false;
      // eslint-disable-next-line no-case-declarations
      let countUpdAux = 0;
      try {
        const job = new CronJob(
          `*/${process.env.INTERVAL_TO_IMPORT} * * * * *`,
          () => {
            if (!isRunning) {
              isRunning = true;
              setTimeout(async () => {
                if (countUpdAux % 50 === 0) {
                  await AuxiliariesControllerv2();
                  countUpdAux = 0;
                }
                countUpdAux += 1;

                await importNews();
                isRunning = false;
              }, 3000);
            }
          },
        );
        job.start();
      } catch (err) {
        logger.error(`Finished with error: ${err}`);
        isRunning = false;
      }
      break;

    case 'api':
      logger.info('API mode');

      runCheck();
      break;

    // case 'reprocessTasks':
    //   logger.info(
    //     `Every ${process.env.INTERVAL_TO_IMPORT} seconds check tasks with error...`,
    //   );

    //   // eslint-disable-next-line no-case-declarations
    //   let isRunningRep = false;
    //   try {
    //     const job = new CronJob(
    //       `*/${process.env.INTERVAL_TO_IMPORT} * * * * *`,
    //       () => {
    //         if (!isRunningRep) {
    //           isRunningRep = true;
    //           setTimeout(async () => {
    //             await reprocessTasksWithError();
    //             isRunningRep = false;
    //           }, 3000);
    //         }
    //       },
    //     );
    //     job.start();
    //   } catch (err) {
    //     logger.error(`Finished with error: ${err}`);
    //     isRunningRep = false;
    //   }
    //   break;

    default:
      logger.warn('Sorry, that is not something I know how to do.');
      process.exit(1);
  }
};

export { serverListen /* , serviceStatus, checkTasks */ };
