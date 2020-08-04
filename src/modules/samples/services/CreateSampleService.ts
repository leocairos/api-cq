import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISamplesRepository from '../repositories/ISamplesRepository';

import Sample from '../infra/typeorm/entities/Sample';
import {
  IServiceCenterDTO,
  ISampleConclusionDTO,
} from '../dtos/IAuxiliariesDTO';

interface IRequest {
  id: number;
  identification: string;
  serviceCenter: IServiceCenterDTO;
  sampleConclusion?: ISampleConclusionDTO;
}

@injectable()
class CreateSampleService {
  constructor(
    @inject('SamplesRepository')
    private samplesRepository: ISamplesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id,
    identification,
    serviceCenter,
    sampleConclusion,
  }: IRequest): Promise<Sample> {
    const sample = await this.samplesRepository.create({
      id,
      identification,
      serviceCenter,
      sampleConclusion: sampleConclusion?.id ? sampleConclusion : undefined,
    });

    return sample;
  }
}

export default CreateSampleService;
