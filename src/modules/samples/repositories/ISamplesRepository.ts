import Sample from '../infra/typeorm/entities/Sample';

import ICreateSampleDTO from '../dtos/ICreateSampleDTO';

export default interface ISamplesRepository {
  create(data: ICreateSampleDTO): Promise<Sample>;
  findById(id: string): Promise<Sample | undefined>;
}
