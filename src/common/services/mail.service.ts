import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_EMAIL'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_EMAIL'),
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      log(error);
      throw error;
    }
  }
}
