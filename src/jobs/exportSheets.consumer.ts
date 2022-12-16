import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';
import xlsx from 'node-xlsx';
import * as path from 'path';
import { SheetsService } from 'src/sheets/sheets.service';

@Processor('sheet-queue')
class exportSheetsConsumer {
  constructor(private readonly sheetsService: SheetsService) {}
  @Process('sheet-job')
  async exportSheets(job: Job) {
    const dataSheet = xlsx.parse(
      fs.readFileSync(
        path.resolve(__dirname, '..', '..', 'tmp', job.data.file.filenames),
      ),
    );
    const result = Object.values(dataSheet[0].data).map((value) => ({
      name: value[0],
      cpf: value[1],
      phone: value[2],
      address: value[3],
    }));
    result.shift();
    result.forEach((data) => {
      this.sheetsService.create(data);
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    fs.rmSync(
      path.resolve(__dirname, '..', '..', 'tmp', job.data.file.filename),
    );
    // return { message: 'Job completed successfully' };
  }
}
export { exportSheetsConsumer };
