import { FileRepositoryInterface } from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUploadFile } from './interfaces/ActiveUser.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FileRepositoryInterface')
    private readonly fileRepository: FileRepositoryInterface,
  ) {}

  async getFile(product: string) {
    const res = await this.fileRepository.findByCondition({
      where: { product },
    });
    if (res === null) {
      throw new RpcException({ statusCode: 404, message: 'File not found' });
    }

    return res;
  }

  async getFileVersion(product: string) {
    const res = await this.fileRepository.findByCondition({
      where: { product },
    });
    if (res === null) {
      throw new RpcException({ statusCode: 404, message: 'File not found' });
    }

    return {version: res.version};
  }

  async uploadFile(file: IUploadFile) {
    const fileExtName = file.originalname.split('.').pop();
    const res = await this.fileRepository.findByConditionWithoutFail({
      where: { product: `${file.product}.${fileExtName}` },
    });
    if (res) {
      throw new ConflictException();
    } else {
      const currentTime = new Date();
      return this.fileRepository.save({
        product: `${file.product}.${fileExtName}`,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        version: file.version,
        uploadDate: currentTime,
      });
    }
  }
}
