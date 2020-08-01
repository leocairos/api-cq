import { IServiceCenter } from '../IAuxiliariesDTO';

export default interface ICreateSampleDTO {
  Id: number;
  Identification: string;
  ServiceCenter: IServiceCenter;
}
