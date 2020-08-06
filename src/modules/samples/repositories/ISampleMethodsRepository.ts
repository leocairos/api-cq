import SampleMethod from '../infra/typeorm/entities/SampleMethod';

import ICreateSampleMethodDTO from '../dtos/ICreateSampleMethodDTO';

export default interface ISampleMethodsRepository {
  create(data: ICreateSampleMethodDTO): Promise<SampleMethod>;
}
