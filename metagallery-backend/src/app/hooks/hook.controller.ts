import { IWebhook } from '@moralisweb3/streams-typings';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { VerifySignature } from './hook.guard';
import { HookService } from './hook.service';

@Controller('hooks')
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @Post()
  @UseGuards(VerifySignature)
  executeHook(@Body() body: IWebhook) {
    return this.hookService.executeHook(body);
  }

  @Post('/test')
  @UseGuards(VerifySignature)
  testHook(@Body() body: IWebhook) {
    return this.hookService.testHook(body);
  }
}
