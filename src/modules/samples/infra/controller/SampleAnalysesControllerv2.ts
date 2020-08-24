import apiMYLIMS from '@shared/services/apiMYLIMS';

import { getRepository } from 'typeorm';
import { ISampleAnalyse } from '../../dtos/ISampleMYLIMSDTO';
import SampleAnalyse from '../typeorm/entities/SampleAnalyse';

const SampleAnalysesController = async (sampleId: number): Promise<number> => {
  const ormRepository = getRepository(SampleAnalyse);
  const analyses = await apiMYLIMS.get(`/samples/${sampleId}/Analyses`);

  const sampleAnalysesData = analyses.data.Result as ISampleAnalyse[];

  const sampleAnalysesToSave = sampleAnalysesData.map(analyse => {
    const sampleAnalyseSaved = ormRepository.create({
      id: analyse.Id,
      order: analyse.Order,
      measurementUnit: analyse.MeasurementUnit?.Identification,
      displayValue: analyse.DisplayValue,
      valueFloat: analyse.ValueFloat,
      referenceMethod: analyse.ReferenceMethod,
      methodAnalysisType: analyse.MethodAnalysisType?.Identification,
      conclusion: analyse.Conclusion?.Identification,
      sample_id: sampleId,
      method_id: analyse.Method?.Id,
      analysis_group_id: analyse.AnalysisGroup?.Id,
      info_id: analyse.Info.Id,
    });

    return sampleAnalyseSaved;
  });

  const toSave = await Promise.all(sampleAnalysesToSave);
  const sampleAnalysisSaved = await ormRepository.save(toSave);
  // logger.info(` ${sampleId}, Analysis: ${sampleAnalysisSaved.length}`);
  return sampleAnalysisSaved.length;
};

export default SampleAnalysesController;
