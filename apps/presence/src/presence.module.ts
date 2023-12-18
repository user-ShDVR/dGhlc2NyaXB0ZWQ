import { Module } from '@nestjs/common';

import {
  SharedModule,
  PostgresDBModule,
  UserEntity,
  UsersRepository,
} from '@app/shared';

import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PostgresDBModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [PresenceController],
  providers: [
    PresenceService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
})
export class PresenceModule {}
