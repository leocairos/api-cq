import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleAnalyseService from '@modules/samples/services/CreateSampleAnalyseService';
import ICreateSampleAnalyseDTO from '@modules/samples/dtos/ICreateSampleAnalyseDTO';
import { ISampleAnalyse } from '../../dtos/ISampleMYLIMSDTO';

const SampleAnalyses = async (
  sampleId: number,
): Promise<ICreateSampleAnalyseDTO[]> => {
  const analyses = await apiMYLIMS.get(`/samples/${sampleId}/Analyses`);

  const sampleAnalysesData = analyses.data.Result as ISampleAnalyse[];

  const createSampleAnalyse = container.resolve(CreateSampleAnalyseService);

  const sampleAnalysesPromises = sampleAnalysesData.map(async analyse => {
    const sampleAnalyseSaved = await createSampleAnalyse.execute({
      id: analyse.Id,
      order: analyse.Order,
      measurementUnit: analyse.MeasurementUnit?.Identification,
      displayValue: analyse.DisplayValue,
      valueFloat: analyse.ValueFloat,
      referenceMethod: analyse.ReferenceMethod,
      methodAnalysisType: analyse.MethodAnalysisType?.Identification,
      conclusion: analyse.Conclusion?.Identification,
      sampleId,
      methodId: analyse.Method?.Id,
      analysisGroupId: analyse.AnalysisGroup?.Id,
      infoId: analyse.Info.Id,
    });
    return sampleAnalyseSaved;
  });

  const sampleAnalysesCQ = await Promise.all(sampleAnalysesPromises);
  //  console.log('  Analyses:', sampleAnalysesPromises.length);
  return sampleAnalysesCQ;
};

export default SampleAnalyses;
