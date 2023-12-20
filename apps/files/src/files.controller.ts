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
import { fileStorage } from '../../../libs/shared/src/storage/storage';
import { IUploadFile } from './interfaces/ActiveUser.interface';

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
    return await this.filesService.getFile(payload.product);
  }

  @MessagePattern('get-file-version')
  async getFileVersion(
    @Ctx() context: RmqContext,
    @Payload() payload: { product: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return await this.filesService.getFileVersion(payload.product);
  }

  @MessagePattern('upload-file')
  async uploadFile(
    @Ctx() context: RmqContext,
    @Payload() payload: { file: IUploadFile },
    
  ) {
    this.sharedService.acknowledgeMessage(context);
    return await this.filesService.uploadFile(payload.file);
  }
}
