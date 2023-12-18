import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { FileEntity } from '../entities/files.entity';
import { FileRepositoryInterface } from '../interfaces/files.repository.interface';

@Injectable()
export class FilesRepository
  extends BaseAbstractRepository<FileEntity>
  implements FileRepositoryInterface
{
  constructor(
    @InjectRepository(FileEntity)
    private readonly FilesRepository: Repository<FileEntity>,
  ) {
    super(FilesRepository);
  }
}
