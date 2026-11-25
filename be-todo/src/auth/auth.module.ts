import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';
import { AccountsService } from './accounts.service.js';
import { AuthCode } from './auth-code.entity.js';
import { AuthCodesService } from './auth-codes.service.js';
import { AuthMailService } from './auth-mail.service.js';
import { AuthController } from './auth.controller.js';
import { CredentialsService } from './credentials.service.js';
import { JwtAuth } from './jwt-auth.provider.js';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([AuthCode])],
  controllers: [AuthController],
  providers: [
    JwtAuth,
    CredentialsService,
    AccountsService,
    AuthCodesService,
    AuthMailService,
  ],
})
export class AuthModule {}
