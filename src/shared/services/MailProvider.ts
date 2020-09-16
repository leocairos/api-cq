import nodemailer, { Transporter } from 'nodemailer';
import mailConfig from '@config/mail';
import logger from '@config/logger';

interface ISendMailDTO {
  to: { name: string; email: string };
  from?: { name: string; email: string };
  subject: string;
  html: string;
}

export default class MailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    html,
  }: ISendMailDTO): Promise<void> {
    logger.info(`Sending email "${subject}" to ${to.email}`);

    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });

    logger.info('Email successfully sent!');
  }
}
