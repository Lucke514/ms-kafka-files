import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { FileDescriptor } from './types';

@Injectable()
export class FilesService {
  constructor(private readonly httpService: HttpService) {}

  async processUploadedFiles(files: Express.Multer.File[]) {
    const results: Array<{ filename: string; status: string }> = [];

    for (const file of files) {
      await this.processFileBuffer(file.originalname, file.buffer);
      results.push({ filename: file.originalname, status: 'processed' });
    }

    await this.notifyCompletion({
      source: 'http-upload',
      total: results.length,
    });

    return {
      processed: results,
      notified: true,
    };
  }

  async processFileDescriptors(files: FileDescriptor[]) {
    const results: Array<{ id: string; status: string }> = [];

    for (const file of files) {
      await this.processRemoteFile(file);
      results.push({ id: file.id, status: 'processed' });
    }

    await this.notifyCompletion({
      source: 'kafka',
      total: results.length,
    });

    return {
      processed: results,
      notified: true,
    };
  }

  private async processFileBuffer(filename: string, buffer: Buffer) {
    await this.simulateWork(filename, buffer.length);
  }

  private async processRemoteFile(file: FileDescriptor) {
    await this.simulateWork(file.filename, file.url.length);
  }

  private async simulateWork(label: string, size: number) {
    const delayMs = Math.min(500, Math.max(50, size));
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private async notifyCompletion(payload: { source: string; total: number }) {
    const response$ = this.httpService.post(
      'http://downstream-service.local/notifications/files-complete',
      payload,
    );

    await lastValueFrom(response$);
  }
}
