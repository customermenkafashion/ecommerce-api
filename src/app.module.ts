
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './modules/mysql/products/products.module';
import { UsersModule } from './modules/mysql/users/users.module';
import { AuthModule } from './modules/mysql/auth/auth.module';
import { CategoriesModule } from './modules/mysql/categories/categories.module';
import { OrdersModule } from './modules/mysql/orders/orders.module';
import { OrderItemsModule } from './modules/mysql/order-items/order-items.module';
import { PaymentsModule } from './modules/mysql/payments/payments.module';
import { ReviewsModule } from './modules/mysql/reviews/reviews.module';
import { CartModule } from './modules/mysql/cart/cart.module';
import { RolesModule } from './modules/mysql/roles/roles.module';

import { PermissionsModule } from './modules/mysql/permissions/permissions.module';
import { AddressesModule } from './modules/mysql/addresses/addresses.module';
import { HealthModule } from './health/health.module';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';

import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';

import { MailService } from './shared/mail/mail.service';

import paginationConfig from './config/pagination.config';
import paymentConfig from './config/payment.config';
import elasticsearchConfig from './config/elasticsearch.config';

import { RequestIdMiddleware } from './middlewares/request-id/request-id.middleware';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { UserContextMiddleware } from './middlewares/user-context/user-context.middleware';
import { SalesReportsModule } from './modules/mysql/sales-reports/sales-reports.module';
import { ActivityLogsModule } from './modules/mongodb/activity-logs/activity-logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './modules/mongodb/events/events.module';
import { FramesModule } from './modules/mongodb/frames/frames.module';
import { AnalyticsModule } from './modules/mongodb/analytics/analytics.module';
import { NotificationModule } from './modules/mongodb/notification/notification.module';
import { ReportsModule } from './modules/mongodb/reports/reports.module';
import { EmailTemplatesModule } from './modules/mongodb/email-templates/email-templates.module';
import { WatchHistoryModule } from './modules/mongodb/watch-history/watch-history.module';
import { PlayListModule } from './modules/mongodb/play-list/play-list.module';
import { AssetsModule } from './modules/mongodb/assets/assets.module';
import { EventCategoriesModule } from './modules/mongodb/event-categories/event-categories.module';
import { LikesModule } from './modules/mongodb/likes/likes.module';
import { CommentsModule } from './modules/mongodb/comments/comments.module';
import { EventReviewsModule } from './modules/mongodb/event-reviews/event-reviews.module';
import { Transaction } from './modules/mysql/transactions/entities/transaction.entity';

@Module({
  imports: [

    MongooseModule.forRoot('mongodb://localhost:27017/ecommerce', {
      // Remove deprecated options
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '1d' },
    }),


    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),

    BullModule.registerQueue({
      name: 'mail',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, paginationConfig,paymentConfig,elasticsearchConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
      }),
    }),

    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    ReviewsModule,
    CartModule,
    RolesModule,
    PermissionsModule,
    AddressesModule,
    HealthModule,
    SalesReportsModule,
    // PaginationModule
    ActivityLogsModule,
    EventsModule,
    FramesModule,
    AnalyticsModule,
    NotificationModule,
    ReportsModule,
    EmailTemplatesModule,
    WatchHistoryModule,
    PlayListModule,
    AssetsModule,
    EventCategoriesModule,
    LikesModule,
    CommentsModule,
    EventReviewsModule,
    Transaction
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MailService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        LoggerMiddleware,
        AuthMiddleware,
        UserContextMiddleware,
      )
      .forRoutes('*'); // global
  }
}



