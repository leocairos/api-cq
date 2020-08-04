interface ISample {
  id: number;
}

interface IInfo {
  id: number;
}

export default interface ICreateSampleInfoDTO {
  id: number;
  order: number;
  displayValue: string;
  sample: ISample;
  info: IInfo;
}
