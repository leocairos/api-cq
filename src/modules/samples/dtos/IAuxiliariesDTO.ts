export interface ISampleConclusionDTO {
  id: number;
  identification: string;
}

export interface ISampleReasonDTO {
  id: number;
  identification: string;
}

export interface IServiceCenterDTO {
  id: number;
  identification: string;
}

export interface ISampleStatusDTO {
  id: number;
  identification: string;
}

export interface ISampleTypeDTO {
  id: number;
  identification: string;
}

export interface IMyLIMSUserDTO {
  id: number;
  identification: string;
}

export interface ICollectionPointDTO {
  id: number;
  identification: string;
}

export interface IInfoDTO {
  id: number;
  identification: string;
}

export interface IMethodTypeDTO {
  id: number;
  identification: string;
}

export interface IServiceAreaDTO {
  id: number;
  identification: string;
  serviceCenter?: IServiceCenterDTO;
}

export interface IMethodDTO {
  id: number;
  identification: string;
  methodType?: IMethodTypeDTO;
}

export interface IMethodStatusDTO {
  id: number;
  identification: string;
}
