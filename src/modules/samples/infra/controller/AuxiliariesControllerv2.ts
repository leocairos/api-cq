import { getRepository } from 'typeorm';

import createConnection from '@shared/infra/typeorm';
import apiMYLIMS from '@shared/services/apiMYLIMS';
import logger from '@config/logger';

import SampleConclusion from '../typeorm/entities/SampleConclusion';
import SampleReason from '../typeorm/entities/SampleReason';
import ServiceCenter from '../typeorm/entities/ServiceCenter';
import SampleStatus from '../typeorm/entities/SampleStatus';
import SampleType from '../typeorm/entities/SampleType';
import MyLIMSUser from '../typeorm/entities/MyLIMSUser';
import CollectionPoint from '../typeorm/entities/CollectionPoint';
import Info from '../typeorm/entities/Info';
import ServiceArea from '../typeorm/entities/ServiceArea';
import MethodType from '../typeorm/entities/MethodType';
import MethodStatus from '../typeorm/entities/MethodStatus';
import Method from '../typeorm/entities/Method';
import AnalisisGroup from '../typeorm/entities/AnalysisGroup';

import {
  ISampleConclusion,
  ISampleReason,
  IServiceCenter,
  ISampleStatus,
  ISampleType,
  IMyLIMSUser,
  ICollectionPoint,
  IInfo,
  IMethodType,
  IMethodStatus,
  IMethod,
  IAnalysisGroup,
  IServiceArea,
} from '../../dtos/ISampleMYLIMSDTO';

const queryParms = '?$inlinecount=allpages&$orderby=Id desc&$top=10000&$skip=0';

const updateSampleConclusion = async (): Promise<void> => {
  const ormRepository = getRepository(SampleConclusion);
  const auxiliar = await apiMYLIMS.get(`/sampleconclusions${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleConclusion[];

  const auxiliarToSave = auxiliarData.map(auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);
  const auxiliarSaved = await ormRepository.save(toSave);

  logger.info(`Updated Sample Conclusions: ${auxiliarSaved.length} records`);
};

const updateSampleReasons = async (): Promise<void> => {
  const ormRepository = getRepository(SampleReason);
  const auxiliar = await apiMYLIMS.get(`/samplereasons${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleReason[];

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    const auxiliarSaved = await ormRepository.save(auxiliarCreated);
    return auxiliarSaved;
  });

  await Promise.all(auxiliarPromises);
  logger.info(`Updated Sample Reasons: ${auxiliarPromises.length} records`);
};

const updateServiceCenter = async (): Promise<void> => {
  const ormRepository = getRepository(ServiceCenter);
  const auxiliar = await apiMYLIMS.get(`/servicecenters${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IServiceCenter[];

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    const auxiliarSaved = await ormRepository.save(auxiliarCreated);
    return auxiliarSaved;
  });

  await Promise.all(auxiliarPromises);
  logger.info(`Updated Service Center: ${auxiliarPromises.length} records`);
};

const updateSampleStatus = async (): Promise<void> => {
  const ormRepository = getRepository(SampleStatus);
  const auxiliar = await apiMYLIMS.get(`/SampleStatus${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleStatus[];

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    const auxiliarSaved = await ormRepository.save(auxiliarCreated);
    return auxiliarSaved;
  });

  await Promise.all(auxiliarPromises);
  logger.info(`Updated Sample Status: ${auxiliarPromises.length} records`);
};

const updateSampleType = async (): Promise<void> => {
  const ormRepository = getRepository(SampleType);
  const auxiliar = await apiMYLIMS.get(`/sampletypes${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleType[];

  const auxiliarToSave = auxiliarData.map(auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);
  const auxiliarSaved = await ormRepository.save(toSave);
  // await Promise.all(auxiliarPromises);
  logger.info(`Updated Sample Type: ${auxiliarSaved.length} records`);
};

const updateMyLIMSUser = async (): Promise<void> => {
  const ormRepository = getRepository(MyLIMSUser);
  const auxiliar = await apiMYLIMS.get(`/Users${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMyLIMSUser[];

  const auxiliarToSave = auxiliarData.map(async auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);
  const auxiliarSaved = await ormRepository.save(toSave);
  logger.info(`Updated MyLIMS Users: ${auxiliarSaved.length} records`);
};

const updateCollectionPoint = async (): Promise<void> => {
  const ormRepository = getRepository(CollectionPoint);
  const auxiliar = await apiMYLIMS.get(`/collectionpoints${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ICollectionPoint[];

  const auxiliarToSave = auxiliarData.map(auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);

  const auxiliarSaved = await ormRepository.save(toSave);
  logger.info(`Updated Collection Points: ${auxiliarSaved.length} records`);
};

const updateInfo = async (): Promise<void> => {
  const ormRepository = getRepository(Info);
  const auxiliar = await apiMYLIMS.get(`/infos${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IInfo[];

  const auxiliarToSave = auxiliarData.map(auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);
  const auxiliarSaved = await ormRepository.save(toSave);
  logger.info(`Updated Infos: ${auxiliarSaved.length} records`);
};

const updateServiceArea = async (): Promise<void> => {
  const ormRepository = getRepository(ServiceArea);
  const auxiliar = await apiMYLIMS.get(`/serviceareas${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IServiceArea[];

  const auxiliarToSave = auxiliarData.map(auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
      service_center_id: auxiliarItem.ServiceCenter.Id,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);
  const auxiliarSaved = await ormRepository.save(toSave);
  logger.info(`Updated Service Areas: ${auxiliarSaved.length} records`);
};

const updateMethodType = async (): Promise<void> => {
  const ormRepository = getRepository(MethodType);
  const auxiliar = await apiMYLIMS.get(`/MethodTypes${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMethodType[];

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    const auxiliarSaved = await ormRepository.save(auxiliarCreated);
    return auxiliarSaved;
  });

  await Promise.all(auxiliarPromises);
  logger.info(`Updated Method Types: ${auxiliarPromises.length} records`);
};

const updateMethodStatus = async (): Promise<void> => {
  const ormRepository = getRepository(MethodStatus);
  const auxiliar = await apiMYLIMS.get(`/MethodStatus${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMethodStatus[];

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    const auxiliarSaved = await ormRepository.save(auxiliarCreated);
    return auxiliarSaved;
  });

  await Promise.all(auxiliarPromises);
  logger.info(`Updated Method Status: ${auxiliarPromises.length} records`);
};

const updateMethod = async (): Promise<void> => {
  const ormRepository = getRepository(Method);
  const auxiliar = await apiMYLIMS.get(`/methods${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMethod[];

  const auxiliarToSave = auxiliarData.map(auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
      method_type_id: auxiliarItem.MethodType.Id,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);
  const auxiliarSaved = await ormRepository.save(toSave);
  logger.info(`Updated Methods: ${auxiliarSaved.length} records`);
};

const updateAnalysisGroup = async (): Promise<void> => {
  const ormRepository = getRepository(AnalisisGroup);
  const auxiliar = await apiMYLIMS.get(`/AnalysisGroups${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IAnalysisGroup[];

  const auxiliarToSave = auxiliarData.map(auxiliarItem => {
    const auxiliarCreated = ormRepository.create({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarCreated;
  });

  const toSave = await Promise.all(auxiliarToSave);
  const auxiliarSaved = await ormRepository.save(toSave);
  logger.info(`Updated Analysis Groups: ${auxiliarSaved.length} records`);
};

const updAuxiliaries = async (): Promise<void> => {
  logger.info('Updating auxiliary...');
  try {
    await createConnection();
  } catch {
    //
  }
  await updateSampleConclusion();
  await updateSampleReasons();
  await updateServiceCenter();
  await updateSampleStatus();
  await updateSampleType();
  await updateMyLIMSUser();
  await updateCollectionPoint();
  await updateInfo();
  await updateServiceArea();
  await updateMethodType();
  await updateMethodStatus();
  await updateMethod();
  await updateAnalysisGroup();
};

export default updAuxiliaries;