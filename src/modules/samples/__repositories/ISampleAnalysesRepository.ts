import SampleAnalyses from '../infra/typeorm/entities/SampleAnalyse';

import ICreateSampleAnalysesDTO from '../dtos/ICreateSampleAnalyseDTO';

export default interface ISampleAnalysessRepository {
  create(data: ICreateSampleAnalysesDTO): Promise<SampleAnalyses>;
}
