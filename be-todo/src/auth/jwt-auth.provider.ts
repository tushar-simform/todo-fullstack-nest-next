import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import { toPublicUser, UsersService } from '../users/users.service.js';

/** Authenticates `Authorization: Bearer <jwt>`; the user becomes `@CurrentUser()`. */
@Injectable()
export class JwtAuth extends JwtBearerProvider<
  ReturnType<typeof toPublicUser>
> {
  constructor(
    private readonly users: UsersService,
    registry: AuthenticationRegistry,
  ) {
    // Key, issuer and audience come from the `accessToken` module options.
    super({ realm: 'be-todo' });
    registry.registerProvider(this);
  }

  /** Called after signature and claims are verified. null = reject the token. */
  async validate({ sub }: JwtClaims) {
    const user = sub ? await this.users.findById(sub) : null;
    return user ? toPublicUser(user) : null;
  }
}
