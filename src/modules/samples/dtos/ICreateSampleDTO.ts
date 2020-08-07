import {
  IServiceCenterDTO,
  ISampleConclusionDTO,
  ISampleReasonDTO,
  ISampleTypeDTO,
  ICollectionPointDTO,
  ISampleStatusDTO,
  IMyLIMSUserDTO,
} from './IAuxiliariesDTO';

export default interface ICreateSampleDTO {
  id: number;
  identification: string;
  controlNumber: string;
  number: number;
  year: number;
  subNumber: number;
  revision: number;
  active: boolean;
  syncPortal: boolean;
  received: boolean;
  finalized: boolean;
  published: boolean;
  reviewed: boolean;
  takenDateTime: Date;
  receivedTime: Date;
  finalizedTime: Date;
  publishedTime: Date;
  reviewedTime: Date;

  sampleStatus?: ISampleStatusDTO;
  currentStatusUser?: IMyLIMSUserDTO;
  currentStatusEditionDateTime?: Date;

  sampleServiceCenter?: IServiceCenterDTO;
  sampleConclusion?: ISampleConclusionDTO;
  sampleReason?: ISampleReasonDTO;
  sampleType?: ISampleTypeDTO;
  sampleCollectionPoint?: ICollectionPointDTO;
}
