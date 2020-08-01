import {
  IServiceCenter,
  ISampleConclusion,
  ISampleReason,
  ISampleStatus,
  IMyLIMSUser,
  ISampleType,
  ICollectionPoint,
} from './IAuxiliariesDTO';

// api/v2/samples
export interface ISample {
  Id: number;
  Identification: string;
  ControlNumber: string;
  Number: number;
  Year: number;
  SubNumber: number;
  Revision: number;
  Active: boolean;
  SyncPortal: boolean;
  Received: boolean;
  Finalized: boolean;
  Published: boolean;
  Reviewed: boolean;
  TakenDateTime: Date;
  ReceivedTime: Date;
  FinalizedTime: Date;
  PublishedTime: Date;
  ReviewedTime: Date;
  ServiceCenter: IServiceCenter;
  SampleConclusion: ISampleConclusion;
  SampleReason: ISampleReason;
  CurrentStatus: {
    Id: number;
    SampleStatus: ISampleStatus;
    EditionUser: IMyLIMSUser;
    EditionDateTime: Date;
  };
  SampleType: ISampleType;

  CollectionPoint: ICollectionPoint;
}

// api/v2/{sampleId}/infos
export interface IInfo {
  Id: number;
  Order: number;
  Info: {
    Id: number;
    Identification: string;
  };
  DisplayValue: string;
}

// api/v2/{sampleId}/methods
interface IMethod {
  Id: number;
  Method: {
    MasterId: number;
    Version: number;
    Id: number;
    MethodType: {
      Id: number;
      Identification: string;
    };
    Identification: string;
  };
  ServiceArea: {
    Id: number;
    Identification: string;
  };
  CurrentStatus: {
    Id: number;
    MethodStatus: {
      Id: number;
      Identification: string;
    };
    EditionUser: {
      Id: number;
      Identification: string;
    };
    EditionDateTime: Date;
    ExecuteUser: {
      Id: number;
      Identification: string;
    };
    ExecuteDateTime: Date;
    StartUser: {
      Id: number;
      Identification: string;
    };
    StartDateTime: Date;
  };
}

// api/v2/{sampleId}/Analyses
interface IAnalyse {
  Id: number;
  Method: {
    Id: number;
    MasterId: number;
    Identification: string;
  };
  AnalysisGroup: {
    Id: number;
    Identification: string;
  };
  Info: {
    Id: number;
    Identification: string;
  };
  MeasurementUnit: {
    Id: number;
    Identification: string;
  };
  Conclusion: {
    Id: number;
    Identification: string;
  };
  MethodAnalysisType: {
    Id: number;
    Identification: string;
  };
  DisplayValue: string;
  ForceScale: number;
  ValueFloat: number;
  Order: number;
  K: string;
  Veff: string;
  ReferenceMethod: string;
}
