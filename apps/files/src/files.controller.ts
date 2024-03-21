import {
  ConflictException,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { FilesService } from './files.service';
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
    try {
      const result = await this.filesService.uploadFile(payload.file);
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new RpcException({
          statusCode: 409,
          message:
            'Такой файл уже загружен, вы можете обновить файл в личном кабинете либо загрузить файл под новым продуктом',
        });
      } else {
        throw error; // Пробросить другие исключения
      }
    }
  }

  @MessagePattern('update-file')
  async updateFile(
    @Ctx() context: RmqContext,
    @Payload() payload: { file: IUploadFile },
  ) {
    this.sharedService.acknowledgeMessage(context);
    try {
      const result = await this.filesService.updateFile(payload.file);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          statusCode: 404,
          message: 'Такого фала не существует, попробуйте загрузить новый!',
        });
      } else {
        throw error; // Пробросить другие исключения
      }
    }
  }
}
