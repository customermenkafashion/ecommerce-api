import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '@shared/mail/mail.service';

@Injectable()
export class EmailJob {
  private readonly logger = new Logger(EmailJob.name);

  constructor(private readonly mailService: MailService) {}

  async sendWelcomeEmail(to: string, username: string) {
    const subject = 'Welcome to Our E-commerce Platform!';
    const body = `Hello ${username}, thank you for joining us!`;

    const result = await this.mailService.sendMail(to, subject, body);
    // if (result) {
      this.logger.log(`Welcome email sent to ${to}`);
    // }
  }

  async sendOrderConfirmation(to: string, orderId: number) {
    const subject = `Your Order #${orderId} is Confirmed`;
    const body = `Thank you for your purchase! Your order #${orderId} is being processed.`;

    const result = await this.mailService.sendMail(to, subject, body);
    // if (result) {
      this.logger.log(`Order confirmation email sent to ${to}`);
    // }
  }
}
