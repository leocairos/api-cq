import SampleConclusion from '../infra/typeorm/entities/SampleConclusion';
import SampleReason from '../infra/typeorm/entities/SampleReason';
import ServiceCenter from '../infra/typeorm/entities/ServiceCenter';
import SampleStatus from '../infra/typeorm/entities/SampleStatus';
import SampleType from '../infra/typeorm/entities/SampleType';
import MyLIMSUser from '../infra/typeorm/entities/MyLIMSUser';
import CollectionPoint from '../infra/typeorm/entities/CollectionPoint';
import Info from '../infra/typeorm/entities/Info';

import {
  ISampleConclusionDTO,
  ISampleReasonDTO,
  IServiceCenterDTO,
  ISampleStatusDTO,
  ISampleTypeDTO,
  IMyLIMSUserDTO,
  ICollectionPointDTO,
  IInfoDTO,
} from '../dtos/IAuxiliariesDTO';

export default interface IAuxiliariesRepository {
  saveSampleConclusion(data: ISampleConclusionDTO): Promise<SampleConclusion>;
  saveSampleReason(data: ISampleReasonDTO): Promise<SampleReason>;
  saveServiceCenter(data: IServiceCenterDTO): Promise<ServiceCenter>;
  saveSampleStatus(data: ISampleStatusDTO): Promise<SampleStatus>;
  saveSampleType(data: ISampleTypeDTO): Promise<SampleType>;
  saveMyLIMSUser(data: IMyLIMSUserDTO): Promise<MyLIMSUser>;
  saveCollectionPoint(data: ICollectionPointDTO): Promise<CollectionPoint>;
  saveInfo(data: IInfoDTO): Promise<Info>;
}
