import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleMethodService from '@modules/samples/services/CreateSampleMethodService';
import ICreateSampleMethodDTO from '@modules/samples/dtos/ICreateSampleMethodDTO';
import { ISampleMethod } from '../../dtos/ISampleMYLIMSDTO';

const SampleMethods = async (
  sampleId: number,
): Promise<ICreateSampleMethodDTO[]> => {
  const methods = await apiMYLIMS.get(`/samples/${sampleId}/methods`);

  const sampleMethodsData = methods.data.Result as ISampleMethod[];

  const createSampleMethod = container.resolve(CreateSampleMethodService);

  const sampleMethodsPromises = sampleMethodsData.map(async method => {
    // const sampleMethodsPromises: ICreateSampleMethodDTO[] = [];
    // sampleMethodsData.forEach(async method => {
    const sampleMethodSaved = await createSampleMethod.execute({
      id: method.Id,
      sampleId,
      methodId: method.Method.Id,
      serviceAreaId: method.ServiceArea.Id,
      methodStatusId: method.CurrentStatus?.MethodStatus?.Id,
      editionUserId: method.CurrentStatus?.EditionUser?.Id,
      editionDateTime: method.CurrentStatus?.EditionDateTime,
      executeUserId: method.CurrentStatus?.ExecuteUser?.Id,
      executeDateTime: method.CurrentStatus?.ExecuteDateTime,
      startUserId: method.CurrentStatus?.StartUser?.Id,
      startDateTime: method.CurrentStatus?.StartDateTime,
    });
    return sampleMethodSaved;
    // sampleMethodsPromises.push(sampleMethodSaved);
  });

  const sampleMethodsCQ = await Promise.all(sampleMethodsPromises);
  return sampleMethodsCQ;
};

export default SampleMethods;
