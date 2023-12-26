import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestService } from './request.service';
import { join } from 'path';
import { Response } from 'express';
import { fileStorage } from '@app/shared/storage/storage';
import { Observable, Observer } from 'rxjs';
import { ApiKeyGuard } from '@app/shared/guards/api-key.guard';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';
import { SetActiveUserDto } from './dto/set-active-user-dto';
import { UploadFileDto } from './dto/upload-file-dto';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    @Inject('FILES_SERVICE') private readonly filesService: ClientProxy,
    private requestService: RequestService,
  ) {}
  @ApiTags('users')
  @Get('users')
  async getUsers() {
    return this.requestService.sendRequest(this.authService, 'get-users');
  }

  @ApiTags('online')
  @Get('activeUsers/:product')
  async getActiveUsers(@Param('product') product: string) {
    return this.requestService.sendRequest(
      this.presenceService,
      'get-active-users',
      { product },
    );
  }
  @ApiTags('users')
  @ApiOperation({ summary: 'Create user' })
  @Post('createUser/:product')
  async createUser(
    @Param('product') product: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.requestService.sendRequest(
      this.authService,
      'create-user',
      { product, hwid: createUserDto.hwid },
    );
  }
  @ApiTags('online')
  @ApiOperation({ summary: 'Set active user' })
  @Post('activeUser/:product')
  async setActiveUsers(
    @Param('product') product: string,
    @Body() setActiveUser: SetActiveUserDto,
  ) {
    return this.requestService.sendRequest(
      this.presenceService,
      'set-active-user',
      { product, hwid: setActiveUser.hwid },
    );
  }
  @ApiTags('files')
  @Get('file/:product')
  async getFile(@Param('product') product: string, @Res() res: Response) {
    const file$: Observable<any> = this.requestService.sendRequest(
      this.filesService,
      'get-file',
      { product },
    );

    const observer: Observer<any> = {
      next: (result) => {
        const filePath = join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',
          '..',
          'uploads',
          result.filename,
        );
        res.sendFile(filePath);
      },
      error: (error) => {
        res.status(error.statusCode).send(error);
      },
      complete: () => {},
    };

    file$.subscribe(observer);
  }
  @ApiTags('files')
  @Get('fileVersion/:product')
  async getFileVersion(@Param('product') product: string) {
    return this.requestService.sendRequest(
      this.filesService,
      'get-file-version',
      { product },
    );
  }
  @ApiTags('files')
  @ApiConsumes('multipart/form-data') 
  @ApiHeader({
    name: 'x-api-key',
    description: 'Ключ для загрузки',
    required: true,
  })
  @Post('files/:product')
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /^(application\/x-msdos-program|application\/octet-stream)$/,
        })
        .addMaxSizeValidator({ maxSize: 25 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Param('product') product: string,
    @Body() uploadFile: UploadFileDto,
  ) {
    return this.requestService.sendRequest(this.filesService, 'upload-file', {
      file: { product, version: uploadFile.version, ...file },
    });
  }
}
