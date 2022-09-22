import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataSheetDocument = DataSheet & Document;

@Schema({ versionKey: false })
export class DataSheet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cpf: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;
}

export const DataSheetSchema = SchemaFactory.createForClass(DataSheet);
