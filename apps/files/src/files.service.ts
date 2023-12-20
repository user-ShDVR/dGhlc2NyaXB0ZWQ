import { FileRepositoryInterface, UserEntity, UserRepositoryInterface } from '@app/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';
import { IUploadFile } from './interfaces/ActiveUser.interface';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FileRepositoryInterface')
    private readonly fileRepository: FileRepositoryInterface,
  ) {}

  async getFile(product: string) {
    try {
      const res = await this.fileRepository.findByCondition({ where: { product} }); 
      return res;
    } catch (error) {
      return error;
    }
  }

  async getFileVersion(product: string) {
    try {
      const res = await this.fileRepository.findByCondition({ where: { product} }); 
      return { version: res.version };
    } catch (error) {
      return error;
    }
  }

  async uploadFile(file: IUploadFile) {
    const fileExtName = file.originalname.split('.').pop();
    const currentTime = new Date();
    return this.fileRepository.save({
      product: `${file.product}.${fileExtName}`,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      version: file.version,
      uploadDate: currentTime
    });  
  }
}
