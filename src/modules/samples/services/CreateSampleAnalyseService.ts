import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISampleAnalysesRepository from '../repositories/ISampleAnalysesRepository';

import SampleAnalyse from '../infra/typeorm/entities/SampleAnalyse';

interface IRequest {
  id: number;
  order: number;
  measurementUnit: string;
  displayValue: string;
  valueFloat: number;
  referenceMethod: string;
  methodAnalysisType: string;
  conclusion: string;

  sampleId: number;
  methodId: number;
  analysisGroupId: number;
  infoId: number;
}

@injectable()
class CreateSampleAnalyseService {
  constructor(
    @inject('SampleAnalysesRepository')
    private sampleAnalysesRepository: ISampleAnalysesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id,
    order,
    measurementUnit,
    displayValue,
    valueFloat,
    referenceMethod,
    methodAnalysisType,
    conclusion,
    sampleId,
    methodId,
    analysisGroupId,
    infoId,
  }: IRequest): Promise<SampleAnalyse> {
    const sampleAnalyse = await this.sampleAnalysesRepository.create({
      id,
      order,
      measurementUnit,
      displayValue,
      valueFloat,
      referenceMethod,
      methodAnalysisType,
      conclusion,
      sample: { id: sampleId },
      method: { id: methodId },
      analysisGroup: { id: analysisGroupId },
      info: { id: infoId },
    });

    return sampleAnalyse;
  }
}

export default CreateSampleAnalyseService;
