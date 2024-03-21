import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        autoLoadEntities: true,
        synchronize: true, // [ShDVR]: #TODO убрать при выходе в бету, можем терять данные из за этого
      }),

      inject: [ConfigService],
    }),
  ],
})
export class PostgresDBModule {}
