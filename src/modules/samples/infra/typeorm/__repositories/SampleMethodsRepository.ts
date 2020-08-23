import { getRepository, Repository } from 'typeorm';

import ISampleMethodsRepository from '@modules/samples/repositories/ISampleMethodsRepository';

import ICreateSampleMethodDTO from '@modules/samples/dtos/ICreateSampleMethodDTO';
import SampleMethod from '../entities/SampleMethod';

class SampleMethodsRepository implements ISampleMethodsRepository {
  private ormRepository: Repository<SampleMethod>;

  constructor() {
    this.ormRepository = getRepository(SampleMethod);
  }

  public async create({
    id,
    sample,
    method,
    serviceArea,
    methodStatus,
    editionUser,
    editionDateTime,
    executeUser,
    executeDateTime,
    startUser,
    startDateTime,
  }: ICreateSampleMethodDTO): Promise<SampleMethod> {
    const createdSampleMethod = this.ormRepository.create({
      id,
      sample: { id: sample.id },
      method: { id: method.id },
      serviceArea: { id: serviceArea.id },
      methodStatus: { id: methodStatus.id },
      editionUser: { id: editionUser.id },
      editionDateTime,
      executeUser: { id: executeUser.id },
      executeDateTime,
      startUser: { id: startUser.id },
      startDateTime,
    });

    // console.log('>>>sample>>>', createdSampleMethod);
    await this.ormRepository.save(createdSampleMethod);

    return createdSampleMethod;
  }
}

export default SampleMethodsRepository;
