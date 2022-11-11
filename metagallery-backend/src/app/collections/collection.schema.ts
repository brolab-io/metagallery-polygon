import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true, unique: true })
  collectionId: string;

  @Prop({ required: true })
  collectionName: string;

  @Prop()
  collectionURIs: string;

  @Prop()
  collectionThemeId: string;

  @Prop({ lowercase: true, required: true })
  collectionOwner: string;
}

export type CollectionDocument = Collection & Document;

export const CollectionSchema = SchemaFactory.createForClass(Collection);

CollectionSchema.plugin(mongoosePaginate);
