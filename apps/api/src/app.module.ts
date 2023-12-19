import { Module } from '@nestjs/common';

import { SharedModule } from '@app/shared';

import { AppController } from './app.controller';
import { RequestService } from './request.service';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq('FILES_SERVICE', process.env.RABBITMQ_FILES_QUEUE),
    SharedModule.registerRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
  ],
  controllers: [AppController],
  providers: [RequestService],
})
export class AppModule {}
