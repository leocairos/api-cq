import { getRepository } from 'typeorm';

import apiMYLIMS from '@shared/services/apiMYLIMS';

import { ISampleInfo } from '../../dtos/ISampleMYLIMSDTO';
import SampleInfo from '../typeorm/entities/SampleInfo';

const SampleInfos = async (sampleId: number): Promise<number> => {
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

  const toSave = await Promise.all(sampleInfosToSave);
  const sampleInfosSaved = await ormRepository.save(toSave);
  // logger.info(` ${sampleId}, Infos: ${sampleInfosPromises.length}`);
  return sampleInfosSaved.length;
};

export default SampleInfos;
