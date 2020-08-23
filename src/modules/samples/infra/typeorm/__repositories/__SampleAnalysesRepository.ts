import { getRepository, Repository } from 'typeorm';

import ISampleAnalysesRepository from '@modules/samples/repositories/ISampleAnalysesRepository';

import ICreateSampleAnalyseDTO from '@modules/samples/dtos/ICreateSampleAnalyseDTO';
import SampleAnalyse from '../entities/SampleAnalyse';

class SampleAnalysesRepository implements ISampleAnalysesRepository {
  private ormRepository: Repository<SampleAnalyse>;

  constructor() {
    this.ormRepository = getRepository(SampleAnalyse);
  }

  public async create({
    id,
    order,
    measurementUnit,
    displayValue,
    valueFloat,
    referenceMethod,
    methodAnalysisType,
    conclusion,
    sample,
    method,
    analysisGroup,
    info,
  }: ICreateSampleAnalyseDTO): Promise<SampleAnalyse> {
    const createdSampleAnalyse = this.ormRepository.create({
      id,
      order,
      measurementUnit,
      displayValue,
      valueFloat,
      referenceMethod,
      methodAnalysisType,
      conclusion,
      sample: { id: sample.id },
      method: { id: method.id },
      analysisGroup: { id: analysisGroup.id },
      info: { id: info.id },
    });

    // console.log('>>>sample>>>', createdSampleMethod);
    await this.ormRepository.save(createdSampleAnalyse);

    return createdSampleAnalyse;
  }
}

export default SampleAnalysesRepository;
