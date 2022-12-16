import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';

@Controller('sheets')
export class SheetsController {
  constructor(@InjectQueue('sheet-queue') private sheetQueue: Queue) {}
  @Post()
  @UseInterceptors(FileInterceptor('sheet'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.sheetQueue.add(
      'sheet-job',
      { file: file },
      { attempts: 5, backoff: { type: 'exponential', delay: 5000 } },
    );
    return { message: 'Processando seu arquivo, por favor aguarde...' };
  }
}
