import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { FindQueryResult } from 'src/common/decorators/request';
import { Collection, CollectionDocument } from './collection.schema';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: PaginateModel<CollectionDocument>,
  ) {}

  async upsertCollection(collection: Collection) {
    return this.collectionModel.findOneAndUpdate(
      { collectionId: collection.collectionId },
      collection,
      { upsert: true, new: true },
    );
  }

  async getCollections(findQuery: FindQueryResult) {
    return this.collectionModel.paginate(
      findQuery.filters,
      findQuery.pagination,
    );
  }

  async getCollectionByField(field: string, value: string) {
    const collection = await this.collectionModel.findOne({
      [field]: value,
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }
}
