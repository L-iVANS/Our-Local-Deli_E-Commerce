import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';

export type MailPayload = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  from?: string;
};

export type MailResult = {
  success: boolean;
  skipped?: boolean;
  messageId?: string;
};

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: Transporter;
  private readonly enabled: boolean;
  private readonly defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get<string>('MAIL_ENABLED') === 'true';
    this.defaultFrom =
      this.configService.get<string>('MAIL_FROM') ?? 'no-reply@synchores.local';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<string>('SMTP_PORT') ?? 587),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(payload: MailPayload): Promise<MailResult> {
    if (!this.enabled) {
      this.logger.warn(
        'Mailer is disabled. Set MAIL_ENABLED=true to send emails.',
      );
      return { success: false, skipped: true };
    }

    const mailOptions: SendMailOptions = {
      from: payload.from ?? this.defaultFrom,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      cc: payload.cc,
      bcc: payload.bcc,
      replyTo: payload.replyTo,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error('Failed to send email', error as Error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
