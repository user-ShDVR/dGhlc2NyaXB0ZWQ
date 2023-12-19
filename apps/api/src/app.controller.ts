import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    @Inject('FILES_SERVICE') private readonly filesService: ClientProxy,
  ) {}

  @Get('users')
  async getUsers() {
    console.log('getUsers');
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }
  
  @Get('activeUsers/:product')
  async getActiveUsers(@Param('product') product: string,) {
    console.log(product);
    return this.presenceService.send(
      {
        cmd: 'get-active-users',
      },
      {
        product
      },
    );
  }

  @Post('activeUser/:product')
  async setActiveUsers(@Param('product') product: string, @Body('hwid') hwid: string,) {
    console.log(product);
    console.log('setActiveUsers');
    return this.presenceService.send(
      {
        cmd: 'set-active-user',
      },
      {
        product,
        hwid,
      },
    );
  }

  @Get('files/:name')
  async getFile(@Param('name') name: string,) {
    console.log(name);
    return this.filesService.send(
      {
        cmd: 'get-file',
      },
      {
        name
      },
    );
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    console.log('uploadFile'); //обернуть в промис obserble | emit
    return await this.presenceService.send(
      { 
        cmd: 'upload-file',
      },
      {
        file
      },
    );
  }
}
