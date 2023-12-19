import { Controller, UseInterceptors } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { SharedService } from '@app/shared';

import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';

@Controller()
export class FilesController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly filesService: FilesService,
  ) {}

  @MessagePattern('get-file')
  async getFile(
    @Ctx() context: RmqContext,
    @Payload() payload: { product: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return 'test';
  }

  @MessagePattern('upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  async uploadFile(
    @Ctx() context: RmqContext,
    @Payload() payload: { file: Express.Multer.File },
    
  ) {
    this.sharedService.acknowledgeMessage(context);
    console.log(payload.file)
    return 'test';
  }
}
