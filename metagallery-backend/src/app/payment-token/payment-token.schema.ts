import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
export class PaymentToken {
  @Prop({ required: true, lowercase: true })
  tokenAddress: string;

  @Prop({ required: true })
  tokenSymbol: string;

  @Prop({ required: true })
  tokenDecimals: string;
}

export type PaymentTokenDocument = PaymentToken & Document;

export const PaymentTokenSchema = SchemaFactory.createForClass(PaymentToken);

PaymentTokenSchema.plugin(mongoosePaginate);
