import IServiceCenterDTO from './IServiceCenterDTO';
import ISampleConclusionDTO from './ISampleConclusionDTO';

export default interface ICreateSampleDTO {
  id: number;
  identification: string;
  serviceCenter: IServiceCenterDTO;
  sampleConclusion?: ISampleConclusionDTO;
}
