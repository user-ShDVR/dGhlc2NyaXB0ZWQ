import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { SharedService } from '@app/shared';

import { FilesService } from './files.service';

@Controller()
export class FilesController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly filesService: FilesService,
  ) {}
  
  @MessagePattern({ cmd: 'get-test' })
  async getActiveUsers(
    @Ctx() context: RmqContext,
    @Payload() payload: { product: string },
  ) {
    try {
      this.sharedService.acknowledgeMessage(context);
      return 'test';
    } catch (error) {
      return error
    }
  }
}
