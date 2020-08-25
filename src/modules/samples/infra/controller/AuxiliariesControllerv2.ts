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

  await apiMYLIMS
    .get(`/sampleconclusions${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as ISampleConclusion[];

      const auxiliarToSave = auxiliarData.map(auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(
            `Updated Sample Conclusions: ${auxiliarSaved.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateSampleConclusion] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateSampleConclusion Get] Aborted with error: ${error}`);
    });
};

const updateSampleReasons = async (): Promise<void> => {
  const ormRepository = getRepository(SampleReason);
  await apiMYLIMS
    .get(`/samplereasons${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as ISampleReason[];

      const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        const auxiliarSaved = await ormRepository.save(auxiliarCreated);
        return auxiliarSaved;
      });

      await Promise.all(auxiliarPromises)
        .then(() => {
          logger.info(
            `Updated Sample Reasons: ${auxiliarPromises.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateSampleReasons] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateSampleReasons Get] Aborted with error: ${error}`);
    });
};

const updateServiceCenter = async (): Promise<void> => {
  const ormRepository = getRepository(ServiceCenter);
  await apiMYLIMS
    .get(`/servicecenters${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IServiceCenter[];

      const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        const auxiliarSaved = await ormRepository.save(auxiliarCreated);
        return auxiliarSaved;
      });

      await Promise.all(auxiliarPromises)
        .then(() => {
          logger.info(
            `Updated Service Center: ${auxiliarPromises.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateServiceCenter] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateServiceCenter Get] Aborted with error: ${error}`);
    });
};

const updateSampleStatus = async (): Promise<void> => {
  const ormRepository = getRepository(SampleStatus);
  await apiMYLIMS
    .get(`/SampleStatus${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as ISampleStatus[];

      const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        const auxiliarSaved = await ormRepository.save(auxiliarCreated);
        return auxiliarSaved;
      });

      await Promise.all(auxiliarPromises)
        .then(() => {
          logger.info(
            `Updated Sample Status: ${auxiliarPromises.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateSampleStatus] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateSampleStatus Get] Aborted with error: ${error}`);
    });
};

const updateSampleType = async (): Promise<void> => {
  const ormRepository = getRepository(SampleType);
  await apiMYLIMS
    .get(`/sampletypes${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as ISampleType[];

      const auxiliarToSave = auxiliarData.map(auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(`Updated Sample Type: ${auxiliarSaved.length} records`);
        })
        .catch(error => {
          logger.error(`[updateSampleType] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateSampleType Get] Aborted with error: ${error}`);
    });
};

const updateMyLIMSUser = async (): Promise<void> => {
  const ormRepository = getRepository(MyLIMSUser);
  await apiMYLIMS
    .get(`/Users${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IMyLIMSUser[];

      const auxiliarToSave = auxiliarData.map(async auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(`Updated MyLIMS Users: ${auxiliarSaved.length} records`);
        })
        .catch(error => {
          logger.error(`[updateMyLIMSUser] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateMyLIMSUser Get] Aborted with error: ${error}`);
    });
};

const updateCollectionPoint = async (): Promise<void> => {
  const ormRepository = getRepository(CollectionPoint);
  await apiMYLIMS
    .get(`/collectionpoints${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as ICollectionPoint[];

      const auxiliarToSave = auxiliarData.map(auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(
            `Updated Collection Points: ${auxiliarSaved.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateCollectionPoint] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateCollectionPoint Get] Aborted with error: ${error}`);
    });
};

const updateInfo = async (): Promise<void> => {
  const ormRepository = getRepository(Info);
  await apiMYLIMS
    .get(`/infos${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IInfo[];

      const auxiliarToSave = auxiliarData.map(auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(`Updated Infos: ${auxiliarSaved.length} records`);
        })
        .catch(error => {
          logger.error(`[updateInfo] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateInfo Get] Aborted with error: ${error}`);
    });
};

const updateServiceArea = async (): Promise<void> => {
  const ormRepository = getRepository(ServiceArea);
  await apiMYLIMS
    .get(`/serviceareas${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IServiceArea[];

      const auxiliarToSave = auxiliarData.map(auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
          service_center_id: auxiliarItem.ServiceCenter.Id,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(`Updated Service Areas: ${auxiliarSaved.length} records`);
        })
        .catch(error => {
          logger.error(`[updateServiceArea] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateServiceArea Get] Aborted with error: ${error}`);
    });
};

const updateMethodType = async (): Promise<void> => {
  const ormRepository = getRepository(MethodType);
  await apiMYLIMS
    .get(`/MethodTypes${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IMethodType[];

      const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        const auxiliarSaved = await ormRepository.save(auxiliarCreated);
        return auxiliarSaved;
      });

      await Promise.all(auxiliarPromises)
        .then(() => {
          logger.info(
            `Updated Method Types: ${auxiliarPromises.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateMethodType] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateMethodType Get] Aborted with error: ${error}`);
    });
};

const updateMethodStatus = async (): Promise<void> => {
  const ormRepository = getRepository(MethodStatus);
  await apiMYLIMS
    .get(`/MethodStatus${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IMethodStatus[];

      const auxiliarPromises = auxiliarData.map(async auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        const auxiliarSaved = await ormRepository.save(auxiliarCreated);
        return auxiliarSaved;
      });

      await Promise.all(auxiliarPromises)
        .then(() => {
          logger.info(
            `Updated Method Status: ${auxiliarPromises.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateMethodStatus] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateMethodStatus Get] Aborted with error: ${error}`);
    });
};

const updateMethod = async (): Promise<void> => {
  const ormRepository = getRepository(Method);
  await apiMYLIMS
    .get(`/methods${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IMethod[];

      const auxiliarToSave = auxiliarData.map(auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
          method_type_id: auxiliarItem.MethodType.Id,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(`Updated Methods: ${auxiliarSaved.length} records`);
        })
        .catch(error => {
          logger.error(`[updateMethod] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateMethod Get] Aborted with error: ${error}`);
    });
};

const updateAnalysisGroup = async (): Promise<void> => {
  const ormRepository = getRepository(AnalisisGroup);
  await apiMYLIMS
    .get(`/AnalysisGroups${queryParms}`)
    .then(async auxiliar => {
      const auxiliarData = auxiliar.data.Result as IAnalysisGroup[];

      const auxiliarToSave = auxiliarData.map(auxiliarItem => {
        const auxiliarCreated = ormRepository.create({
          id: auxiliarItem.Id,
          identification: auxiliarItem.Identification,
        });

        return auxiliarCreated;
      });

      await Promise.all(auxiliarToSave)
        .then(async toSave => {
          const auxiliarSaved = await ormRepository.save(toSave);
          logger.info(
            `Updated Analysis Groups: ${auxiliarSaved.length} records`,
          );
        })
        .catch(error => {
          logger.error(`[updateAnalysisGroup] Aborted with error: ${error}`);
          // process.exit(1);
        });
    })
    .catch(error => {
      logger.error(`[updateAnalysisGroup Get] Aborted with error: ${error}`);
    });
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
