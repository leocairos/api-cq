import { container } from 'tsyringe';

import SendSampleNotificationEmailService from '@modules/samples/services/SendSampleNotificationEmailService';
import { ISampleDetail } from '@modules/samples/dtos/ISampleNotificationDTO';

export default class SampleMailNotificationController {
  public async create(
    email: string,
    sampleDetail: ISampleDetail,
  ): Promise<boolean> {
    const sendSampleNotificationEmailService = container.resolve(
      SendSampleNotificationEmailService,
    );

    await sendSampleNotificationEmailService.execute(email, sampleDetail);

    return true;
  }
}
