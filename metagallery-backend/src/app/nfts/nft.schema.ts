import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Collection } from '../collections/collection.schema';
import { PaymentToken } from '../payment-token/payment-token.schema';

@Schema({ timestamps: true })
export class Nft {
  @Prop({ required: true, unique: true })
  tokenId: string;

  @Prop({ required: true, lowercase: true })
  owner: string;

  @Prop()
  tokenURI: string;

  @Prop()
  name: string;

  @Prop()
  collectionId: string;

  @Prop({ lowercase: true })
  createdBy: string;

  @Prop()
  tokenPower: string;

  @Prop()
  marketId: string;

  @Prop()
  marketPrice: string;

  @Prop({ lowercase: true })
  marketPaymentToken: string;

  @Prop({ default: false })
  isStaked: boolean;
}

export type NftDocument = Nft & Document;

export const NftSchema = SchemaFactory.createForClass(Nft);

NftSchema.plugin(mongoosePaginate);

NftSchema.virtual('collectionInfo', {
  ref: Collection.name,
  localField: 'collectionId',
  foreignField: 'collectionId',
  justOne: true,
});

NftSchema.virtual('paymentToken', {
  ref: PaymentToken.name,
  localField: 'marketPaymentToken',
  foreignField: 'tokenAddress',
  justOne: true,
});

NftSchema.set('toObject', { virtuals: true });
NftSchema.set('toJSON', { virtuals: true });
