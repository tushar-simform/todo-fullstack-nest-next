import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule, LogMailTransport, SmtpTransport } from '@nestjs/mail';
import { createObserveModule } from '@nestjs/observe';
import { AuthenticationModule } from '@nestjs/authentication';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envSchema, type Env } from './config/env.schema.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_THROTTLERS } from './auth/throttle.decorators.js';
import { JWT_AUDIENCE, JWT_ISSUER, MAIL_TRANSPORT } from './constants/index.js';
import { TodosModule } from './todos/todos.module.js';
import { UsersModule } from './users/users.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Must stay first: loads .env into process.env before ObserveModule.forRoot() reads it below.
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        type: 'postgres',
        uuidExtension: 'pgcrypto',
        url: config.get('DATABASE_URL', { infer: true }),
        autoLoadEntities: true,
        migrations: [import.meta.dirname + '/migrations/*.js'],
        migrationsRun: true,
        // Schema changes go through migrations, never synchronize.
        synchronize: false,
      }),
    }),
    // Per-IP request limit; auth routes set stricter per-email ones. Registered
    // in the root module so it runs before the authentication guard. The
    // `cooldown` throttler is skipped everywhere except on routes marked with
    // @ThrottleEmailSends() (it only exists to space out emails).
    ThrottlerModule.forRoot(APP_THROTTLERS),
    // JWT access tokens only (no sessions, no refresh tokens). Every route
    // requires a valid token unless marked @Public().
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        accessToken: {
          key: config.get('JWT_SECRET', { infer: true }),
          ttl: config.get('JWT_TTL', { infer: true }),
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
        },
        refreshToken: false,
      }),
    }),
    // Verification and password-reset emails. `log` (default) prints them in
    // the server log; set MAIL_TRANSPORT=smtp + SMTP_URL to really send them.
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        transport:
          config.get('MAIL_TRANSPORT', { infer: true }) === MAIL_TRANSPORT.smtp
            ? new SmtpTransport({
                url: config.get('SMTP_URL', { infer: true }),
                pool: true,
              })
            : new LogMailTransport(),
        from: config.get('MAIL_FROM', { infer: true }),
      }),
    }),
    UsersModule,
    AuthModule,
    TodosModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'be-todo',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
