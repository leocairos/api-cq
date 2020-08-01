import { getRepository, Repository } from 'typeorm';

import ISamplesRepository from '@modules/samples/repositories/ISamplesRepository';

import ICreateSampleDTO from '@modules/samples/dtos/ICreateSampleDTO';
import Sample from '../entities/Sample';

class SamplesRepository implements ISamplesRepository {
  private ormRepository: Repository<Sample>;

  constructor() {
    this.ormRepository = getRepository(Sample);
  }

  public async create({
    id,
    identification,
    serviceCenter,
    sampleConclusion,
  }: ICreateSampleDTO): Promise<Sample> {
    const createdSample = this.ormRepository.create({
      id,
      identification,
      serviceCenter,
      sampleConclusion,
    });

    // console.log('>>>sample>>>', createdSample);
    await this.ormRepository.save(createdSample);

    return createdSample;
  }

  public async findById(id: string): Promise<Sample | undefined> {
    const findSample = await this.ormRepository.findOne(id);

    return findSample;
  }
}

export default SamplesRepository;
