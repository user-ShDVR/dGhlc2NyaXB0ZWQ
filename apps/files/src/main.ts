import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SharedService } from '@app/shared';

import { FilesModule } from './files.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  app.enableCors();

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_FILES_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  await app.startAllMicroservices();

  await app.listen(7000);
}
bootstrap();
