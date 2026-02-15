// src/listeners/user.listener.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent , UserUpdatedEvent , UserDeletedEvent , UserRestoredEvent } from '../modules/mongodb/events/user.event';
import { MailService } from '../shared/mail/mail.service';
import { MailQueue } from '../queues/mail/mail.queue';

@Injectable()
export class UserListener {
  constructor(private readonly mailService: MailService, private readonly mailQueue: MailQueue) {
    this.logger.log('✅ mail service loaded');
  }
  private readonly logger = new Logger(UserListener.name);

  // CREATE
  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    this.logger.log(`🎉 User created: ${event.email}`);

    // await this.mailService.sendMail(
    //   event.email,
    //   'Welcome 🎉',
    //   `Hello ${event.name}, welcome to our platform!`,
    // );

    await this.mailQueue.sendWelcomeMail({
      email: event.email,
      name: event.name,
    });
  }

  // UPDATE
  @OnEvent('user.updated')
  handleUserUpdated(event: UserUpdatedEvent) {
    this.logger.log(`User updated: ${event.id} (${event.name})`);
    this.syncWithCRM(event);
    this.logAnalytics(event);
  }

  // DELETE
  @OnEvent('user.deleted')
  handleUserDeleted(event: UserDeletedEvent) {
    this.logger.warn(`User deleted: ${event.id} (${event.name})`);
    this.removeFromCache(event);
    this.logAnalytics(event);
  }

  // RESTORE (optional if using soft deletes)
  @OnEvent('user.restored')
  handleUserRestored(event: UserRestoredEvent) {
    this.logger.log(`User restored: ${event.id} (${event.name})`);
    this.reindexSearch(event);
    this.logAnalytics(event);
  }

  // === Example Actions ===
  private sendWelcomeEmail(event: UserCreatedEvent) {
    this.logger.log(`Sending welcome email to ${event.email}`);
    // integrate with MailService
  }

  private syncWithCRM(event: UserUpdatedEvent) {
    this.logger.log(`Syncing updated user ${event.id} with CRM`);
    // integrate with CRMService
  }

  private removeFromCache(event: UserDeletedEvent) {
    this.logger.log(`Removing user ${event.id} from cache`);
    // integrate with RedisService
  }

  private reindexSearch(event: UserRestoredEvent) {
    this.logger.log(`Reindexing user ${event.id} in search engine`);
    // integrate with SearchService
  }

  private logAnalytics(event: any) {
    this.logger.log(`Logging analytics for user ${event.id}`);
    // integrate with AnalyticsService
  }
}





// // src/events/listeners/user.listener.ts
// // src/events/listeners/user.listener.ts
// import { Injectable } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import { UserCreatedEvent } from '../events/user.event';

// @Injectable()
// export class UserListener {
//   constructor() {
//     console.log('✅ UserListener registered');
//   }

//   @OnEvent('user.created')
//   handleUserCreated(event: UserCreatedEvent) {
//     console.log('🎉 UserListener fired');
//     console.log(event);
//   }
// }
