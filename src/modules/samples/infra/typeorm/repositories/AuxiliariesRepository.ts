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
} from '@modules/samples/dtos/IAuxiliariesDTO';

import SampleConclusion from '../entities/SampleConclusion';
import SampleReason from '../entities/SampleReason';
import ServiceCenter from '../entities/ServiceCenter';
import SampleStatus from '../entities/SampleStatus';
import SampleType from '../entities/SampleType';
import MyLIMSUser from '../entities/MyLIMSUser';
import CollectionPoint from '../entities/CollectionPoint';
import Info from '../entities/Info';

class AuxiliariesRepository implements IAuxiliariesRepository {
  private ormRepositorySampleConclusion: Repository<SampleConclusion>;

  private ormRepositorySampleReason: Repository<SampleReason>;

  private ormRepositoryServiceCenter: Repository<ServiceCenter>;

  private ormRepositorySampleStatus: Repository<SampleStatus>;

  private ormRepositorySampleType: Repository<SampleType>;

  private ormRepositoryMyLIMSUser: Repository<MyLIMSUser>;

  private ormRepositoryCollectionPoint: Repository<CollectionPoint>;

  private ormRepositoryInfo: Repository<Info>;

  constructor() {
    this.ormRepositorySampleConclusion = getRepository(SampleConclusion);
    this.ormRepositorySampleReason = getRepository(SampleReason);
    this.ormRepositoryServiceCenter = getRepository(ServiceCenter);
    this.ormRepositorySampleStatus = getRepository(SampleStatus);
    this.ormRepositorySampleType = getRepository(SampleType);
    this.ormRepositoryMyLIMSUser = getRepository(MyLIMSUser);
    this.ormRepositoryCollectionPoint = getRepository(CollectionPoint);
    this.ormRepositoryInfo = getRepository(Info);
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
}

export default AuxiliariesRepository;
