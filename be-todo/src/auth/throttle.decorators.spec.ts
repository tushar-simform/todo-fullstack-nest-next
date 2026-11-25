import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { APP_THROTTLERS, ThrottleEmailSends } from './throttle.decorators.js';

@Controller('t')
class TestController {
  @Post('send')
  @HttpCode(204)
  @ThrottleEmailSends()
  send(@Body() _body: { email: string }) {}

  @Post('plain')
  @HttpCode(204)
  plain(@Body() _body: { email: string }) {}
}

describe('email-send throttling', () => {
  let http: ReturnType<typeof request>;
  const post = (path: string, email: string) => http.post(path).send({ email });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot(APP_THROTTLERS)],
      controllers: [TestController],
      providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    }).compile();
    const app = moduleRef.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
  });

  it('allows one send, then blocks the same email with the wait in Retry-After-cooldown', async () => {
    await post('/t/send', 'a@b.test').expect(204);
    const blocked = await post('/t/send', 'a@b.test').expect(429);
    const wait = Number(blocked.headers['retry-after-cooldown']);
    expect(wait).toBeGreaterThan(55);
    expect(wait).toBeLessThanOrEqual(60);
  });

  it('counts per email (case does not matter), so other addresses are unaffected', async () => {
    await post('/t/send', 'a@b.test').expect(204);
    await post('/t/send', 'other@b.test').expect(204);
    await post('/t/send', ' A@B.test ').expect(429);
  });

  it('does not apply the cooldown to routes that are not marked', async () => {
    for (let i = 0; i < 5; i++) await post('/t/plain', 'a@b.test').expect(204);
  });
});
