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
    sampleStatus,
    currentStatusUser,
    currentStatusEditionDateTime,
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
  }: ICreateSampleDTO): Promise<Sample> {
    const createdSample = this.ormRepository.create({
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
      sampleStatus,
      currentStatusUser,
      currentStatusEditionDateTime,
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
    });

    // console.log('>>>sample>>>', createdSample);
    await this.ormRepository.save(createdSample);

    return createdSample;
  }
}

export default SamplesRepository;
