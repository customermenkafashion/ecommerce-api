import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserListener } from   '../../../listeners/user.listener';
import { UserSubscriber } from '../../../subscribers/user.subscriber';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from '../../../shared/mail/mail.module';

import { MailQueueModule } from '../../../queues/mail/mail.module';
import { IsFieldExistConstraint } from '../../../common/validators/is-field-exist.decorator';




@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EventEmitterModule.forRoot(), // 👈 once globally or here
    MailModule, // ✅ makes MailService injectable
    MailQueueModule, // 🔥 FIX
     
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UserListener,
    UserSubscriber,
    IsFieldExistConstraint
  ],
  exports: [UsersService],
})
export class UsersModule {}
