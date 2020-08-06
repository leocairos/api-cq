interface ISample {
  id: number;
}

interface IMethod {
  id: number;
}

interface IServiceArea {
  id: number;
}

interface IMethodStatus {
  id: number;
}

interface IUser {
  id: number;
}

export default interface ICreateSampleMethodDTO {
  id: number;
  sample: ISample;
  method: IMethod;
  serviceArea: IServiceArea;
  methodStatus: IMethodStatus;
  editionUser: IUser;
  editionDateTime: Date;
  executeUser: IUser;
  executeDateTime: Date;
  startUser: IUser;
  startDateTime: Date;
}
