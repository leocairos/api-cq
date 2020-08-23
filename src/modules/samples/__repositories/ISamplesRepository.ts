import Sample from '../infra/typeorm/entities/Sample';

import ICreateSampleDTO from '../dtos/ICreateSampleDTO';

export default interface ISamplesRepository {
  create(data: ICreateSampleDTO): Promise<Sample>;
  findLastEdition(): Promise<Date>;
}
