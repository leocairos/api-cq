import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISampleInfosRepository from '../repositories/ISampleInfosRepository';

import SampleInfo from '../infra/typeorm/entities/SampleInfo';

interface IRequest {
  id: number;
  displayValue: string;
  order: number;
  sampleId: number;
  infoId: number;
}

@injectable()
class CreateSampleInfoService {
  constructor(
    @inject('SampleInfosRepository')
    private sampleInfosRepository: ISampleInfosRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id,
    displayValue,
    order,
    sampleId,
    infoId,
  }: IRequest): Promise<SampleInfo> {
    const sampleInfo = await this.sampleInfosRepository.create({
      id,
      displayValue,
      order,
      sample: { id: sampleId },
      info: { id: infoId },
    });

    return sampleInfo;
  }
}

export default CreateSampleInfoService;
