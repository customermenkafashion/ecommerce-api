import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailQueue } from './mail.queue';
import { MailProcessor } from './mail.processor';
import { MailModule } from '../../shared/mail/mail.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
    MailModule, // provides MailService
  ],
  providers: [MailQueue, MailProcessor],
  exports: [MailQueue], // 🔥 IMPORTANT
})
export class MailQueueModule {}
