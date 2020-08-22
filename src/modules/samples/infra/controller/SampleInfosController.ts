import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleInfoService from '@modules/samples/services/CreateSampleInfoService';
// import ICreateSampleInfoDTO from '@modules/samples/dtos/ICreateSampleInfoDTO';
// import logger from '@config/logger';
import { ISampleInfo } from '../../dtos/ISampleMYLIMSDTO';

const SampleInfos = async (sampleId: number): Promise<number[]> => {
  const infos = await apiMYLIMS.get(`/samples/${sampleId}/infos`);

  const sampleInfosData = infos.data.Result as ISampleInfo[];

  const createSampleInfo = container.resolve(CreateSampleInfoService);

  const sampleInfosPromises = sampleInfosData.map(async info => {
    // const sampleInfosPromises: ICreateSampleInfoDTO[] = [];
    // sampleInfosData.forEach(async info => {
    const sampleInfoSaved = await createSampleInfo.execute({
      id: info.Id,
      order: info.Order,
      displayValue: info.DisplayValue,
      infoId: info.Info.Id,
      sampleId,
    });
    return sampleInfoSaved.id;
    // sampleInfosPromises.push(sampleInfoSaved);
  });

  const sampleInfosCQ = await Promise.all(sampleInfosPromises);
  // logger.info(` ${sampleId}, Infos: ${sampleInfosPromises.length}`);
  return sampleInfosCQ;
};

export default SampleInfos;
