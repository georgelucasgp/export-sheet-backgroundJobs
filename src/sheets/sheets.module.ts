import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';

import { BullAdapter } from 'bull-board/bullAdapter';
import { exportSheetsConsumer } from 'src/jobs/exportSheets.consumer';
import { DataSheet, DataSheetSchema } from './entities/sheet.entity';
import { SheetsController } from './sheets.controller';
import { SheetsService } from './sheets.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'sheet-queue',
    }),
    MongooseModule.forFeature([
      { name: DataSheet.name, schema: DataSheetSchema },
    ]),
    MulterModule.register({
      dest: './tmp',
    }),
  ],
  controllers: [SheetsController],
  providers: [SheetsService, exportSheetsConsumer],
})
export class SheetsModule {
  constructor(@InjectQueue('sheet-queue') private sheetQueue: Queue) {}
  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sheetQueue)]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
