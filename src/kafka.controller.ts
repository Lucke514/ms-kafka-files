import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilesService } from './files.service';
import { FileDescriptor } from './types';

@Controller()
export class KafkaController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern('files.batch')
  async handleBatch(@Payload() payload: { files: FileDescriptor[] }) {
    const files = payload?.files ?? [];
    return this.filesService.processFileDescriptors(files);
  }
}
