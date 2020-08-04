import SampleInfo from '../infra/typeorm/entities/SampleInfo';

import ICreateSampleInfoDTO from '../dtos/ICreateSampleInfoDTO';

export default interface ISampleInfosRepository {
  create(data: ICreateSampleInfoDTO): Promise<SampleInfo>;
}
