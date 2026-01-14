import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'files-worker',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'files-worker-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
