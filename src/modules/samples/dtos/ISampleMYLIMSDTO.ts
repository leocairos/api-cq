export interface IServiceCenter {
  Id: number;
  Identification: string;
}

export interface ISampleConclusion {
  Id: number;
  Identification: string;
}

export interface ISampleReason {
  Id: number;
  Identification: string;
}

export interface ISampleStatus {
  Id: number;
  Identification: string;
}

export interface IMyLIMSUser {
  Id: number;
  Identification: string;
}

export interface ISampleType {
  Id: number;
  Identification: string;
}

export interface ICollectionPoint {
  Id: number;
  Identification: string;
}

export interface IInfo {
  Id: number;
  Identification: string;
}

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
  SampleType: ISampleType;
  CollectionPoint: ICollectionPoint;

  CurrentStatus: {
    Id: number;
    SampleStatus: ISampleStatus;
    EditionUser: IMyLIMSUser;
    EditionDateTime: Date;
  };
}

// api/v2/{sampleId}/infos
export interface ISampleInfo {
  Id: number;
  Order: number;
  Info: {
    Id: number;
    Identification: string;
  };
  DisplayValue: string;
}

// api/v2/{sampleId}/methods
interface ISampleMethod {
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
interface ISampleAnalyse {
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
