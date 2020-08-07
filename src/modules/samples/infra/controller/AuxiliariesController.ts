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
  IServiceArea,
  IMethodType,
  IMethodStatus,
  IMethod,
  IAnalysisGroup,
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
  console.log(
    '  ',
    'Updated Sample Reasons:',
    auxiliarPromises.length,
    ' records',
  );
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

  console.log(
    '  ',
    'Updated Sample Conclusions:',
    auxiliarPromises.length,
    ' records',
  );
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
  console.log(
    '  ',
    'Updated Service Center:',
    auxiliarPromises.length,
    ' records',
  );
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
  console.log(
    '  ',
    'Updated Sample Status:',
    auxiliarPromises.length,
    ' records',
  );
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
  console.log(
    '  ',
    'Updated Sample Type:',
    auxiliarPromises.length,
    ' records',
  );
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
  console.log(
    '  ',
    'Updated MyLIMS Users:',
    auxiliarPromises.length,
    ' records',
  );
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
  console.log(
    '  ',
    'Updated Collection Points:',
    auxiliarPromises.length,
    ' records',
  );
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
  console.log('  ', 'Updated Infos:', auxiliarPromises.length, ' records');
};

const updateServiceArea = async () => {
  const auxiliar = await apiMYLIMS.get(`/serviceareas${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IServiceArea[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeServiceArea({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
      serviceCenter: {
        id: auxiliarItem.ServiceCenter.Id,
        identification: auxiliarItem.ServiceCenter.Identification,
      },
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  console.log(
    '  ',
    'Updated Service Areas:',
    auxiliarPromises.length,
    ' records',
  );
};

const updateMethodType = async () => {
  const auxiliar = await apiMYLIMS.get(`/MethodTypes${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMethodType[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeMethodType({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  console.log(
    '  ',
    'Updated Method Types:',
    auxiliarPromises.length,
    ' records',
  );
};

const updateMethodStatus = async () => {
  const auxiliar = await apiMYLIMS.get(`/MethodStatus${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMethodStatus[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeMethodStatus({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  console.log(
    '  ',
    'Updated Method Status:',
    auxiliarPromises.length,
    ' records',
  );
};

const updateMethod = async () => {
  const auxiliar = await apiMYLIMS.get(`/methods${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IMethod[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeMethod({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
      methodType: {
        id: auxiliarItem.MethodType.Id,
        identification: auxiliarItem.MethodType.Identification,
      },
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  console.log('  ', 'Updated Methods:', auxiliarPromises.length, ' records');
};

const updateAnalysisGroup = async () => {
  const auxiliar = await apiMYLIMS.get(`/AnalysisGroups${queryParms}`);

  const auxiliarData = auxiliar.data.Result as IAnalysisGroup[];
  const update = container.resolve(UpdateAuxiliariesService);

  const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
    const auxiliarsaved = await update.executeAnalysisGroup({
      id: auxiliarItem.Id,
      identification: auxiliarItem.Identification,
    });

    return auxiliarsaved;
  });

  await Promise.all(auxiliarPromises);
  console.log(
    '  ',
    'Updated Analysis Groups:',
    auxiliarPromises.length,
    ' records',
  );
};

const updAuxiliaries = async () => {
  console.log('Updating auxiliary...');
  await updateSampleReasons();
  await updateSampleConclusion();
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
