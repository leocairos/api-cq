import {
  IServiceCenterDTO,
  ISampleConclusionDTO,
  ISampleReasonDTO,
  ISampleTypeDTO,
  ICollectionPointDTO,
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

  sampleServiceCenter?: IServiceCenterDTO;
  sampleConclusion?: ISampleConclusionDTO;
  sampleReason?: ISampleReasonDTO;
  sampleType?: ISampleTypeDTO;
  sampleCollectionPoint?: ICollectionPointDTO;
}
