import { NestFactory } from '@nestjs/core';
import { PasswordHasher } from '@nestjs/authentication';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, type Repository } from 'typeorm';
import { AppModule } from '../app.module.js';
import { SEED_USER_EMAILS, SEED_USER_PASSWORD } from '../constants/index.js';
import { Todo } from '../todos/todo.entity.js';
import { UsersService } from '../users/users.service.js';

/**
 * Idempotent dev seed: creates the seed users (skips existing ones) and gives
 * any todo without an owner to the first seed user.
 * Run with `npm run seed`.
 */
async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to run the dev seed in production.');
  }
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const users = app.get(UsersService);
    const hasher = app.get(PasswordHasher);
    const todos = app.get<Repository<Todo>>(getRepositoryToken(Todo));

    let firstUserId: string | undefined;
    for (const email of SEED_USER_EMAILS) {
      const existing = await users.findByEmail(email);
      const user =
        existing ??
        (await users.create(email, await hasher.hash(SEED_USER_PASSWORD), {
          emailVerified: true,
        }));
      firstUserId ??= user.id;
      console.log(`${existing ? 'exists ' : 'created'} ${user.email}`);
    }

    if (firstUserId) {
      const { affected } = await todos.update(
        { userId: IsNull() },
        { userId: firstUserId },
      );
      console.log(
        `adopted ${affected ?? 0} ownerless todo(s) -> ${SEED_USER_EMAILS[0]}`,
      );
    }
  } finally {
    await app.close();
  }
}

await seed();
