import { FileRepositoryInterface, UserEntity, UserRepositoryInterface } from '@app/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FileRepositoryInterface')
    private readonly fileRepository: FileRepositoryInterface,
  ) {}

  async getActiveUsers(product: string) {
    return 'Active status updated';  
  }
  async setActiveUser(product: string, hwid: string) {
    return 'Active status updated';  
  }
}
