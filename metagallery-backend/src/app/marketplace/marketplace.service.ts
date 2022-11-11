import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions } from 'mongoose';
import { FindQueryResult } from 'src/common/decorators/request';
import { Nft, NftDocument } from '../nfts/nft.schema';
@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(Nft.name)
    private readonly nftModel: PaginateModel<NftDocument>,
  ) {}

  async getMarketplaceItems(findQuery: FindQueryResult) {
    findQuery.filters['marketId'] = { $ne: null };
    const options: PaginateOptions = {
      ...findQuery.pagination,
      select: '-__v -_id',
      populate: [
        {
          path: 'collectionInfo',
          select: '-__v -_id -owner -createdAt -updatedAt -contract',
        },
        {
          path: 'paymentToken',
          select: '-__v -_id -updatedAt -createdAt -contract',
        },
      ],
    };
    return this.nftModel.paginate(findQuery.filters, options);
  }

  async getMarketplaceItem(field: string, value: string) {
    const item = await this.nftModel
      .findOne({ [field]: value })
      .select('-__v -_id -updatedAt')
      .populate(
        'collectionInfo',
        '-__v -_id -owner -createdAt -updatedAt -contract',
      )
      .populate('paymentToken', '-__v -_id -updatedAt -createdAt -contract');
    if (!item) {
      throw new NotFoundException(`Marketplace item not found`);
    }
    return item;
  }
}
