import { Controller, Get } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import { AppService } from './app.service.js';

/** Health/hello route stays open; everything else requires a JWT. */
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
