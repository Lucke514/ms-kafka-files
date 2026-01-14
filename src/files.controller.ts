import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('batch')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadBatch(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.processUploadedFiles(files ?? []);
  }
}
