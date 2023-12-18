import { FileEntity, UserEntity } from '@app/shared';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: [UserEntity, FileEntity],
  migrations: ['dist/apps/auth/apps/auth/src/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
