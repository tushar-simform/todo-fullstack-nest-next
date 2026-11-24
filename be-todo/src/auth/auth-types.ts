import type { PublicUser } from '../users/users.service.js';

// Tells @nestjs/authentication what `@CurrentUser()` returns.
declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: PublicUser;
    refreshTokens: false;
  }
}
