import {
  Body,
  Controller,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestService } from './request.service';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    @Inject('FILES_SERVICE') private readonly filesService: ClientProxy,
    private requestService: RequestService,
  ) {}

  @Get('users')
  async getUsers() {
    return this.requestService.sendRequest(this.authService, 'get-users');
  }
  
  @Get('activeUsers/:product')
  async getActiveUsers(@Param('product') product: string,) {
    return this.requestService.sendRequest(this.presenceService, 'get-active-users', { product });
  }

  @Post('activeUser/:product')
  async setActiveUsers(@Param('product') product: string, @Body('hwid') hwid: string,) {
    return this.requestService.sendRequest(this.presenceService, 'set-active-user', { product, hwid });
  }

  @Get('files/:name')
  async getFile(@Param('name') name: string,) {
    return this.requestService.sendRequest(this.filesService, 'get-file', { name });
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile( new ParseFilePipe({
    validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 25 })],
  }),) file: Express.Multer.File) {
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, file.originalname);
    return this.requestService.sendRequest(this.filesService, 'upload-file', { formData });
  }
}
