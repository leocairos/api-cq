import apiMYLIMS from '@shared/services/apiMYLIMS';

import { getRepository } from 'typeorm';
import logger from '@config/logger';
import { ISampleAnalyse } from '../../dtos/ISampleMYLIMSDTO';
import SampleAnalyse from '../typeorm/entities/SampleAnalyse';

const SampleAnalysesController = async (sampleId: number): Promise<number> => {
  const ormRepository = getRepository(SampleAnalyse);
  let analysesCount = 0;
  await apiMYLIMS
    .get(`/samples/${sampleId}/Analyses`)
    .then(async analyses => {
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

      let sampleAnalysisCount = 0;
      await Promise.all(sampleAnalysesToSave)
        .then(async toSave => {
          const sampleAnalysisSaved = await ormRepository.save(toSave);
          // logger.info(` ${sampleId}, Analysis: ${sampleAnalysisSaved.length}`);
          sampleAnalysisCount = sampleAnalysisSaved.length;
        })
        .catch(error => {
          logger.error(
            `[SampleAnalysesController] 'sample ${sampleId}' Aborted with error: ${error}`,
          );
          // process.exit(1);
        });
      analysesCount = sampleAnalysisCount;
    })
    .catch(error => {
      logger.error(
        `[SampleAnalysesController Get] 'sample ${sampleId}' Aborted with error: ${error}`,
      );
    });
  return analysesCount;
};

export default SampleAnalysesController;
