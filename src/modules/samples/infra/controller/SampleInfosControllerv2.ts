import { getRepository } from 'typeorm';

import apiMYLIMS from '@shared/services/apiMYLIMS';

import logger from '@config/logger';
import { ISampleInfo } from '../../dtos/ISampleMYLIMSDTO';
import SampleInfo from '../typeorm/entities/SampleInfo';

const SampleInfosController = async (sampleId: number): Promise<number> => {
  const ormRepository = getRepository(SampleInfo);
  const infos = await apiMYLIMS.get(`/samples/${sampleId}/infos`);

  const sampleInfosData = infos.data.Result as ISampleInfo[];

  const sampleInfosToSave = sampleInfosData.map(info => {
    const sampleInfoCreated = ormRepository.create({
      id: info.Id,
      order: info.Order,
      displayValue: info.DisplayValue,
      info_id: info.Info.Id,
      sample_id: sampleId,
    });

    return sampleInfoCreated;
  });

  await Promise.all(sampleInfosToSave)
    .then(async toSave => {
      const sampleInfosSaved = await ormRepository.save(toSave);
      // logger.info(` ${sampleId}, Infos: ${sampleInfosPromises.length}`);
      return sampleInfosSaved.length;
    })
    .catch(error => {
      logger.error(`[SampleInfosController] Aborted with error: ${error}`);
      // process.exit(1);
    });
  return 0;
};

export default SampleInfosController;
