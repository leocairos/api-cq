import { ISampleDetail } from '@modules/samples/dtos/ISampleNotificationDTO';

interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables?: ITemplateVariables;
  sample?: ISampleDetail;
}
