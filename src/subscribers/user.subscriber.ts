
// src/subscribers/user.subscriber.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';
import { User } from '../modules/mysql/users/entities/user.entity';
import { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent, UserRestoredEvent } from '../modules/mongodb/events/user.event';

@Injectable()
export class UserSubscriber implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    console.log('✅ UserSubscriber created');
  }

  onModuleInit() {
    // Register a manual TypeORM subscriber using the NestJS EventEmitter
    this.dataSource.subscribers.push({
      listenTo: () => User,
      afterInsert: (event) => {
        if (!event.entity) return;

        console.log('🔥 User inserted, emitting user.created');
        this.eventEmitter.emit(
          'user.created',
          new UserCreatedEvent(
            event.entity.id,
            event.entity.name,
            event.entity.email,
          ),
        );
      },
      afterUpdate: (event) => {
        if (!event.entity) return;

        console.log('🔥 User updated, emitting user.updated');
        this.eventEmitter.emit(
          'user.created',
          new UserUpdatedEvent(
            event.entity.id,
            event.entity.name,
            event.entity.email,
          ),
        );
      },
      afterRemove: (event) => {
        if (!event.entity) return;

        console.log('🔥 User deleted, emitting user.removed');
        this.eventEmitter.emit(
          'user.created',
          new UserDeletedEvent(
            event.entity.id,
            event.entity.name,
            event.entity.email,
          ),
        );
      },
       afterRetored: (event) => {
        if (!event.entity) return;

        console.log('🔥 User deleted, emitting user.removed');
        this.eventEmitter.emit(
          'user.created',
          new UserRestoredEvent(
            event.entity.id,
            event.entity.name,
            event.entity.email,
          ),
        );
      },
    } as any);
  }
}
