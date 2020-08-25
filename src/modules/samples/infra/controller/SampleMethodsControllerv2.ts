import apiMYLIMS from '@shared/services/apiMYLIMS';
import { getRepository } from 'typeorm';
import logger from '@config/logger';
import { ISampleMethod } from '../../dtos/ISampleMYLIMSDTO';
import SampleMethod from '../typeorm/entities/SampleMethod';

const SampleMethodsController = async (sampleId: number): Promise<number> => {
  const ormRepository = getRepository(SampleMethod);
  let methodsCount = 0;
  await apiMYLIMS
    .get(`/samples/${sampleId}/methods`)
    .then(async methods => {
      const sampleMethodsData = methods.data.Result as ISampleMethod[];

      const sampleMethodsToSave = sampleMethodsData.map(method => {
        const sampleMethodCreated = ormRepository.create({
          id: method.Id,
          sample_id: sampleId,
          method_id: method.Method.Id,
          service_area_id: method.ServiceArea?.Id,
          method_status_id: method.CurrentStatus?.MethodStatus?.Id,
          edition_user_id: method.CurrentStatus?.EditionUser?.Id,
          editionDateTime: method.CurrentStatus?.EditionDateTime,
          execute_user_id: method.CurrentStatus?.ExecuteUser?.Id,
          executeDateTime: method.CurrentStatus?.ExecuteDateTime,
          start_user_id: method.CurrentStatus?.StartUser?.Id,
          startDateTime: method.CurrentStatus?.StartDateTime,
        });
        return sampleMethodCreated;
      });

      let sampleMethodsCount = 0;
      await Promise.all(sampleMethodsToSave)
        .then(async toSave => {
          const sampleMethodsSaved = await ormRepository.save(toSave);
          // logger.info(` ${sampleId}, Methods: ${sampleMethodsSaved.length}`);
          sampleMethodsCount = sampleMethodsSaved.length;
        })
        .catch(error => {
          logger.error(
            `[SampleMethodsController] Aborted with error: ${error}`,
          );
          // process.exit(1);
        });
      methodsCount = sampleMethodsCount;
    })
    .catch(error => {
      logger.error(
        `[SampleMethodsController Get] Aborted with error: ${error}`,
      );
    });

  return methodsCount;
};

export default SampleMethodsController;
