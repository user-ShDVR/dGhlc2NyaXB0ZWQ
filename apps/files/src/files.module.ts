import { Module } from '@nestjs/common';

import {
  PostgresDBModule,
  FileEntity,
  FilesRepository,
  SharedModule,
} from '@app/shared';

import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';

@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    TypeOrmModule.forFeature([FileEntity]),
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'FileRepositoryInterface',
      useClass: FilesRepository,
    },
  ],
})
export class FilesModule {}
