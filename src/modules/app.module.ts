import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EnvironmentModule } from '../configs/environment/environment.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../configs/environment/environment-variables';
import { SessionModule } from './session/session.module';
import { EnvironmentService } from '../configs/environment/environment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../configs/logger/winston.config';

@Module({
  imports: [
    EnvironmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.homology', '.env.production'],
      validate,
    }),
    // Rate limiting configuration
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    // Schedule module for cron jobs
    ScheduleModule.forRoot(),
    // Winston logging module
    WinstonModule.forRoot(winstonConfig),
    UsersModule,
    AuthModule,
    SessionModule,
    HealthModule,
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, EnvironmentModule],
      useFactory: (environmentService: EnvironmentService) => ({
        type: 'postgres',
        host: environmentService.databaseInfo.host,
        port: environmentService.databaseInfo.port,
        username: environmentService.databaseInfo.username,
        password: environmentService.databaseInfo.password,
        database: environmentService.databaseInfo.database,
        entities: ['dist/**/*.entity{.js,.ts}', 'src/**/*.entity{.js.ts}'],
        synchronize: false,
        ssl: {
          ca: process.env.SSL_CERT,
        },
      }),
      inject: [EnvironmentService],
    }),
  ],
  controllers: [],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
