import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class MailQueue {
  constructor(
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
  ) {
    console.log(`🎉 MailQueue..........`);
  }

  async sendWelcomeMail(payload: {
    email: string;
    name: string;
  }) {
    const job = await this.mailQueue.add(
      'welcome-mail',
      payload,
      {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
      },
    );
    console.log(`🆔 Job added with ID: ${job.id}`);
  }
}
