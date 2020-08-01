import { getRepository, Repository } from 'typeorm';

import { ISample } from '../ISampleDTO';
import Sample from '../entities/Sample';

class SamplesRepository {
  private ormRepository: Repository<Sample>;

  constructor() {
    this.ormRepository = getRepository(Sample);
  }

  public async create({
    Id,
    Identification,
    ServiceCenter,
  }: ISample): Promise<Sample> {
    const sample = this.ormRepository.create({
      Id,
      Identification,
      ServiceCenter,
    });

    await this.ormRepository.save(sample);

    return sample;
  }

  public async findById(id: string): Promise<Sample | undefined> {
    const findSample = await this.ormRepository.findOne(id);

    return findSample;
  }
}

export default SamplesRepository;
