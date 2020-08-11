import fs from 'fs';
import logger from '@config/logger';
import SamplesController from '@modules/samples/infra/controller/SamplesControllerSched';
import updAuxiliaries from '@modules/samples/infra/controller/AuxiliariesController';
import apiMYLIMS from './apiMYLIMS';

const lockFile = 'lock.lck';

const formatDate = (date: Date): string => {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
};

const importNews = async () => {
  const samplesController = new SamplesController();
  const lastDate = await samplesController.getLastEditionStored();
  const formatedDate = formatDate(lastDate);
  const baseURL = '/samples?$inlinecount=allpages&$top=5&$skip=0';
  const filter = `CurrentStatus/EditionDateTime ge DATETIME'${formatedDate}'`;

  const samples = await apiMYLIMS.get(`${baseURL}&$filter=${filter}`);

  const totalCount = samples.data.TotalCount as number;

  logger.info(`${totalCount} records until ${formatedDate}`);
  await updAuxiliaries();
  // const skip = 0;
  const top = Number(process.env.COUNT_SINC_AT_TIME);
  let skip = 0;
  // const filter = '';
  while (skip < totalCount) {
    // eslint-disable-next-line no-await-in-loop
    await samplesController.list(skip, top, filter);
    skip += top;
    // console.log('\n\nSkip ', skip, '\n\n');
    logger.info(`Skip ${skip}`);
  }
};

const SyncRecords = async (): Promise<void> => {
  try {
    if (!fs.existsSync(lockFile)) {
      logger.info(`Synchronizing records...`);

      fs.closeSync(fs.openSync(lockFile, 'w'));

      // MySync function
      await importNews();

      fs.unlinkSync(lockFile);
    }
  } catch (err) {
    logger.error(lockFile);
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
  }
};

export default SyncRecords;
