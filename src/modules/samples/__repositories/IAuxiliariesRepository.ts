import SampleConclusion from '../infra/typeorm/entities/SampleConclusion';
import SampleReason from '../infra/typeorm/entities/SampleReason';
import ServiceCenter from '../infra/typeorm/entities/ServiceCenter';
import SampleStatus from '../infra/typeorm/entities/SampleStatus';
import SampleType from '../infra/typeorm/entities/SampleType';
import MyLIMSUser from '../infra/typeorm/entities/MyLIMSUser';
import CollectionPoint from '../infra/typeorm/entities/CollectionPoint';
import Info from '../infra/typeorm/entities/Info';
import ServiceArea from '../infra/typeorm/entities/ServiceArea';
import MethodType from '../infra/typeorm/entities/MethodType';
import MethodStatus from '../infra/typeorm/entities/MethodStatus';
import Method from '../infra/typeorm/entities/Method';
import AnalysisGroup from '../infra/typeorm/entities/AnalysisGroup';

import {
  ISampleConclusionDTO,
  ISampleReasonDTO,
  IServiceCenterDTO,
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
  saveServiceArea(data: IServiceAreaDTO): Promise<ServiceArea>;
  saveMethodType(data: IMethodTypeDTO): Promise<MethodType>;
  saveMethodStatus(data: IMethodStatusDTO): Promise<MethodStatus>;
  saveMethod(data: IMethodDTO): Promise<Method>;
  saveAnalysisGroup(data: IAnalysisGroupDTO): Promise<AnalysisGroup>;
}
