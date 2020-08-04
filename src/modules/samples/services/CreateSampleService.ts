import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISamplesRepository from '../repositories/ISamplesRepository';

import Sample from '../infra/typeorm/entities/Sample';
import {
  IServiceCenterDTO,
  ISampleConclusionDTO,
  ISampleReasonDTO,
  ISampleTypeDTO,
  ICollectionPointDTO,
} from '../dtos/IAuxiliariesDTO';

interface IRequest {
  id: number;
  identification: string;
  controlNumber: string;
  number: number;
  year: number;
  subNumber: number;
  revision: number;
  active: boolean;
  syncPortal: boolean;
  received: boolean;
  finalized: boolean;
  published: boolean;
  reviewed: boolean;
  takenDateTime: Date;
  receivedTime: Date;
  finalizedTime: Date;
  publishedTime: Date;
  reviewedTime: Date;

  sampleServiceCenter?: IServiceCenterDTO;
  sampleConclusion?: ISampleConclusionDTO;
  sampleReason?: ISampleReasonDTO;
  sampleType?: ISampleTypeDTO;
  sampleCollectionPoint?: ICollectionPointDTO;
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
    controlNumber,
    number,
    subNumber,
    year,
    revision,
    active,
    syncPortal,
    received,
    finalized,
    published,
    reviewed,
    takenDateTime,
    receivedTime,
    finalizedTime,
    publishedTime,
    reviewedTime,
    sampleServiceCenter,
    sampleConclusion,
    sampleReason,
    sampleType,
    sampleCollectionPoint,
  }: IRequest): Promise<Sample> {
    const sample = await this.samplesRepository.create({
      id,
      identification,
      controlNumber,
      number,
      subNumber,
      year,
      revision,
      active,
      syncPortal,
      received,
      finalized,
      published,
      reviewed,
      takenDateTime,
      receivedTime,
      finalizedTime,
      publishedTime,
      reviewedTime,
      sampleServiceCenter: sampleServiceCenter?.id
        ? sampleServiceCenter
        : undefined,
      sampleConclusion: sampleConclusion?.id ? sampleConclusion : undefined,
      sampleReason: sampleReason?.id ? sampleReason : undefined,
      sampleType: sampleType?.id ? sampleType : undefined,
      sampleCollectionPoint: sampleCollectionPoint?.id
        ? sampleCollectionPoint
        : undefined,
    });

    return sample;
  }
}

export default CreateSampleService;
