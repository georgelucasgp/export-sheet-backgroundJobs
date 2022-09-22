import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { DataSheet, DataSheetDocument } from './entities/sheet.entity';

@Injectable()
export class SheetsService {
  constructor(
    @InjectModel(DataSheet.name)
    private dataSheetModel: Model<DataSheetDocument>,
  ) {}

  create(createSheetDto: CreateSheetDto) {
    const sheet = new this.dataSheetModel(createSheetDto);
    return sheet.save();
  }
}
