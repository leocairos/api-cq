import { getRepository, Repository } from 'typeorm';

import IAuxiliariesRepository from '@modules/samples/repositories/IAuxiliariesRepository';

import {
  ISampleConclusionDTO,
  IServiceCenterDTO,
  ISampleReasonDTO,
  ISampleStatusDTO,
  ISampleTypeDTO,
  IMyLIMSUserDTO,
  ICollectionPointDTO,
  IInfoDTO,
  IMethodTypeDTO,
  IServiceAreaDTO,
  IMethodStatusDTO,
  IMethodDTO,
  IAnalysisGroupDTO,
} from '@modules/samples/dtos/IAuxiliariesDTO';

import SampleConclusion from '../entities/SampleConclusion';
import SampleReason from '../entities/SampleReason';
import ServiceCenter from '../entities/ServiceCenter';
import SampleStatus from '../entities/SampleStatus';
import SampleType from '../entities/SampleType';
import MyLIMSUser from '../entities/MyLIMSUser';
import CollectionPoint from '../entities/CollectionPoint';
import Info from '../entities/Info';
import ServiceArea from '../entities/ServiceArea';
import MethodType from '../entities/MethodType';
import MethodStatus from '../entities/MethodStatus';
import Method from '../entities/Method';
import AnalysisGroup from '../entities/AnalysisGroup';

class AuxiliariesRepository implements IAuxiliariesRepository {
  private ormRepositorySampleConclusion: Repository<SampleConclusion>;

  private ormRepositorySampleReason: Repository<SampleReason>;

  private ormRepositoryServiceCenter: Repository<ServiceCenter>;

  private ormRepositorySampleStatus: Repository<SampleStatus>;

  private ormRepositorySampleType: Repository<SampleType>;

  private ormRepositoryMyLIMSUser: Repository<MyLIMSUser>;

  private ormRepositoryCollectionPoint: Repository<CollectionPoint>;

  private ormRepositoryInfo: Repository<Info>;

  private ormRepositoryServiceArea: Repository<ServiceArea>;

  private ormRepositoryMethodType: Repository<MethodType>;

  private ormRepositoryMethodStatus: Repository<MethodStatus>;

  private ormRepositoryMethod: Repository<Method>;

  private ormRepositoryAnalysisGroup: Repository<AnalysisGroup>;

  constructor() {
    this.ormRepositorySampleConclusion = getRepository(SampleConclusion);
    this.ormRepositorySampleReason = getRepository(SampleReason);
    this.ormRepositoryServiceCenter = getRepository(ServiceCenter);
    this.ormRepositorySampleStatus = getRepository(SampleStatus);
    this.ormRepositorySampleType = getRepository(SampleType);
    this.ormRepositoryMyLIMSUser = getRepository(MyLIMSUser);
    this.ormRepositoryCollectionPoint = getRepository(CollectionPoint);
    this.ormRepositoryInfo = getRepository(Info);
    this.ormRepositoryServiceArea = getRepository(ServiceArea);
    this.ormRepositoryMethodType = getRepository(MethodType);
    this.ormRepositoryMethodStatus = getRepository(MethodStatus);
    this.ormRepositoryMethod = getRepository(Method);
    this.ormRepositoryAnalysisGroup = getRepository(AnalysisGroup);
  }

  public async saveSampleConclusion({
    id,
    identification,
  }: ISampleConclusionDTO): Promise<SampleConclusion> {
    const createdSampleConclusion = this.ormRepositorySampleConclusion.create({
      id,
      identification,
    });

    await this.ormRepositorySampleConclusion.save(createdSampleConclusion);

    return createdSampleConclusion;
  }

  public async saveSampleReason({
    id,
    identification,
  }: ISampleReasonDTO): Promise<SampleReason> {
    const createdSampleReason = this.ormRepositorySampleReason.create({
      id,
      identification,
    });

    await this.ormRepositorySampleReason.save(createdSampleReason);

    return createdSampleReason;
  }

  public async saveServiceCenter({
    id,
    identification,
  }: IServiceCenterDTO): Promise<ServiceCenter> {
    const createdServiceCenter = this.ormRepositoryServiceCenter.create({
      id,
      identification,
    });

    await this.ormRepositoryServiceCenter.save(createdServiceCenter);

    return createdServiceCenter;
  }

  public async saveSampleStatus({
    id,
    identification,
  }: ISampleStatusDTO): Promise<SampleStatus> {
    const createdSampleStatus = this.ormRepositorySampleStatus.create({
      id,
      identification,
    });

    await this.ormRepositorySampleStatus.save(createdSampleStatus);

    return createdSampleStatus;
  }

  public async saveSampleType({
    id,
    identification,
  }: ISampleTypeDTO): Promise<SampleType> {
    const createdSampleType = this.ormRepositorySampleType.create({
      id,
      identification,
    });

    await this.ormRepositorySampleType.save(createdSampleType);

    return createdSampleType;
  }

  public async saveMyLIMSUser({
    id,
    identification,
  }: IMyLIMSUserDTO): Promise<MyLIMSUser> {
    const createdMyLIMSUser = this.ormRepositoryMyLIMSUser.create({
      id,
      identification,
    });

    await this.ormRepositoryMyLIMSUser.save(createdMyLIMSUser);

    return createdMyLIMSUser;
  }

  public async saveCollectionPoint({
    id,
    identification,
  }: ICollectionPointDTO): Promise<CollectionPoint> {
    const createdCollectionPoint = this.ormRepositoryCollectionPoint.create({
      id,
      identification,
    });

    await this.ormRepositoryCollectionPoint.save(createdCollectionPoint);

    return createdCollectionPoint;
  }

  public async saveInfo({ id, identification }: IInfoDTO): Promise<Info> {
    const createdInfo = this.ormRepositoryInfo.create({
      id,
      identification,
    });

    await this.ormRepositoryInfo.save(createdInfo);

    return createdInfo;
  }

  public async saveServiceArea({
    id,
    identification,
    serviceCenter,
  }: IServiceAreaDTO): Promise<ServiceArea> {
    const createdServiceArea = this.ormRepositoryServiceArea.create({
      id,
      identification,
      sampleServiceCenter: serviceCenter,
    });

    await this.ormRepositoryServiceArea.save(createdServiceArea);

    return createdServiceArea;
  }

  public async saveMethodType({
    id,
    identification,
  }: IMethodTypeDTO): Promise<MethodType> {
    const createdMethodType = this.ormRepositoryMethodType.create({
      id,
      identification,
    });

    await this.ormRepositoryMethodType.save(createdMethodType);

    return createdMethodType;
  }

  public async saveMethodStatus({
    id,
    identification,
  }: IMethodStatusDTO): Promise<MethodStatus> {
    const createdMethodStatus = this.ormRepositoryMethodStatus.create({
      id,
      identification,
    });

    await this.ormRepositoryMethodStatus.save(createdMethodStatus);

    return createdMethodStatus;
  }

  public async saveMethod({
    id,
    identification,
    methodType,
  }: IMethodDTO): Promise<Method> {
    const createdMethod = this.ormRepositoryMethod.create({
      id,
      identification,
      methodMethodType: methodType,
    });

    await this.ormRepositoryMethod.save(createdMethod);

    return createdMethod;
  }

  public async saveAnalysisGroup({
    id,
    identification,
  }: IAnalysisGroupDTO): Promise<AnalysisGroup> {
    const createdAnalysisGroup = this.ormRepositoryAnalysisGroup.create({
      id,
      identification,
    });

    await this.ormRepositoryAnalysisGroup.save(createdAnalysisGroup);

    return createdAnalysisGroup;
  }
}

export default AuxiliariesRepository;
