import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailService } from '../../shared/mail/mail.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('welcome-mail')
  async handleWelcomeMail(job: Job) {
    const { email, name } = job.data;

    await this.mailService.sendMail(
      email,
      'Welcome 🎉',
      `Hello ${name}, welcome to our platform!`,
    );
  }
}
