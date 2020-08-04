import { IServiceCenterDTO, ISampleConclusionDTO } from './IAuxiliariesDTO';

export default interface ICreateSampleDTO {
  id: number;
  identification: string;
  serviceCenter: IServiceCenterDTO;
  sampleConclusion?: ISampleConclusionDTO;
}
