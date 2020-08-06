interface ISample {
  id: number;
}

interface IMethod {
  id: number;
}

interface IAnalysisGroup {
  id: number;
}

interface IInfo {
  id: number;
}

export default interface ICreateSampleMethodDTO {
  id: number;
  order: number;
  measurementUnit: string;
  displayValue: string;
  valueFloat: number;
  referenceMethod: string;
  methodAnalysisType: string;
  conclusion: string;

  sample: ISample;
  method: IMethod;
  analysisGroup: IAnalysisGroup;
  info: IInfo;
}
