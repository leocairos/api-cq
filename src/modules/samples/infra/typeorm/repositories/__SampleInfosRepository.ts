import { getRepository, Repository } from 'typeorm';

import ISampleInfosRepository from '@modules/samples/repositories/ISampleInfosRepository';

import ICreateSampleInfoDTO from '@modules/samples/dtos/ICreateSampleInfoDTO';
import SampleInfo from '../entities/SampleInfo';

class SampleInfosRepository implements ISampleInfosRepository {
  private ormRepository: Repository<SampleInfo>;

  constructor() {
    this.ormRepository = getRepository(SampleInfo);
  }

  public async create({
    id,
    displayValue,
    order,
    sample,
    info,
  }: ICreateSampleInfoDTO): Promise<SampleInfo> {
    const createdSampleInfo = this.ormRepository.create({
      id,
      displayValue,
      order,
      sample: { id: sample.id },
      info: { id: info.id },
    });

    // console.log('>>>sample>>>', createdSampleInfo);
    await this.ormRepository.save(createdSampleInfo);

    return createdSampleInfo;
  }
}

export default SampleInfosRepository;
