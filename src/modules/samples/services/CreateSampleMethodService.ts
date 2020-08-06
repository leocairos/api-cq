import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISampleMethodsRepository from '../repositories/ISampleMethodsRepository';

import SampleMethod from '../infra/typeorm/entities/SampleMethod';

interface IRequest {
  id: number;
  sampleId: number;
  methodId: number;
  serviceAreaId: number;
  methodStatusId: number;
  editionUserId: number;
  editionDateTime: Date;
  executeUserId: number;
  executeDateTime: Date;
  startUserId: number;
  startDateTime: Date;
}

@injectable()
class CreateSampleMethodService {
  constructor(
    @inject('SampleMethodsRepository')
    private sampleMethodsRepository: ISampleMethodsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id,
    sampleId,
    methodId,
    serviceAreaId,
    methodStatusId,
    editionUserId,
    editionDateTime,
    executeUserId,
    executeDateTime,
    startUserId,
    startDateTime,
  }: IRequest): Promise<SampleMethod> {
    const sampleMethod = await this.sampleMethodsRepository.create({
      id,
      sample: { id: sampleId },
      method: { id: methodId },
      serviceArea: { id: serviceAreaId },
      methodStatus: { id: methodStatusId },
      editionUser: { id: editionUserId },
      editionDateTime,
      executeUser: { id: executeUserId },
      executeDateTime,
      startUser: { id: startUserId },
      startDateTime,
    });

    return sampleMethod;
  }
}

export default CreateSampleMethodService;
