import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendSms(to: string, message: string) {
    // Integrate with Twilio, Nexmo, etc.
    this.logger.log(`Sending SMS to ${to}: "${message}"`);
    return true;
  }
}
