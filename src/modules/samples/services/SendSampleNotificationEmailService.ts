import { injectable, inject } from 'tsyringe';
import path from 'path';
import { format } from 'date-fns';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { ISampleDetail } from '@modules/samples/dtos/ISampleNotificationDTO';

@injectable()
class SendSampleNotificationEmailService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(
    email: string,
    sampleDetail: ISampleDetail,
  ): Promise<void> {
    const sampleNotificationTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'sample_notification.hbs',
    );

    // eslint-disable-next-line no-param-reassign
    sampleDetail.takenDateTime = sampleDetail.takenDateTime
      ? format(sampleDetail.takenDateTime as Date, "dd/MM/yyyy 'às' HH:mm'h'")
      : '';

    await this.mailProvider.sendMail({
      to: {
        name: '',
        email,
      },
      subject: `[API-CQ] Atualização da Amostra ${sampleDetail.id}`,
      templateData: {
        file: sampleNotificationTemplate,
        sample: sampleDetail,
      },
    });
  }
}

export default SendSampleNotificationEmailService;
