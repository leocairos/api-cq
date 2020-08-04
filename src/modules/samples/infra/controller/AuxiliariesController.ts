import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import UpdateAuxiliariesService from '@modules/samples/services/UpdateAuxiliariesService';

import {
  ISampleConclusion,
  ISampleReason,
  IServiceCenter,
  ISampleStatus,
  ISampleType,
  IMyLIMSUser,
  ICollectionPoint,
  IInfo,
} from '../../dtos/ISampleMYLIMSDTO';

const queryParms = '?$inlinecount=allpages&$orderby=Id desc&$top=10000&$skip=0';

const updateSampleReasons = async () => {
  const auxiliar = await apiMYLIMS.get(`/samplereasons${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleReason[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeSampleReason({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Sample Reasons:', auxiliarPromises);
};

const updateSampleConclusion = async () => {
  const auxiliar = await apiMYLIMS.get(`/sampleconclusions${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleConclusion[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeSampleConclusion({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Sample Conclusions:', auxiliarPromises);
};

const updateServiceCenter = async () => {
  const auxiliar = await apiMYLIMS.get(`/servicecenters${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IServiceCenter[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeServiceCenter({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Service Centers:', auxiliarPromises);
};

const updateSampleStatus = async () => {
  const auxiliar = await apiMYLIMS.get(`/SampleStatus${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleStatus[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeSampleStatus({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Service Centers:', auxiliarPromises);
};

const updateSampleType = async () => {
  const auxiliar = await apiMYLIMS.get(`/sampletypes${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ISampleType[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeSampleType({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Service Centers:', auxiliarPromises);
};

const updateMyLIMSUser = async () => {
  const auxiliar = await apiMYLIMS.get(`/Users${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMyLIMSUser[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeMyLIMSUser({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Service Centers:', auxiliarPromises);
};

const updateCollectionPoint = async () => {
  const auxiliar = await apiMYLIMS.get(`/collectionpoints${queryParms}`);

  const auxiliarData = auxiliar.data.Result as ICollectionPoint[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeCollectionPoint({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Service Centers:', auxiliarPromises);
};

const updateInfo = async () => {
  const auxiliar = await apiMYLIMS.get(`/infos${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IInfo[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeInfo({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  // console.log('Service Centers:', auxiliarPromises);
};

const updAuxiliaries = async () => {
  await updateSampleReasons();
  // await updateSampleConclusion();
  // await updateServiceCenter();
  // await updateSampleStatus();
  // await updateSampleType();
  // await updateMyLIMSUser();
  // await updateCollectionPoint();
  // await updateInfo();
};

export default updAuxiliaries;
