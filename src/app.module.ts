import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [HttpModule],
  controllers: [FilesController, KafkaController],
  providers: [FilesService],
})
export class AppModule {}
