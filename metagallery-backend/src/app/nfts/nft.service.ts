import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { FindQueryResult } from '../../common/decorators/request';
import { Nft, NftDocument } from './nft.schema';

@Injectable()
export class NftService {
  constructor(
    @InjectModel(Nft.name)
    private readonly nftModel: PaginateModel<NftDocument>,
  ) {}

  async upsertNft(data: Record<string, string>) {
    return this.nftModel.findOneAndUpdate(
      { tokenId: data.tokenId },
      {
        ...data,
        createdBy: data.recipient,
        owner: data.recipient,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async getNfts(findQuery: FindQueryResult) {
    return this.nftModel.paginate(findQuery.filters, findQuery.pagination);
  }

  async getNftByField(field: string, value: string) {
    const collection = await this.nftModel.findOne({
      [field]: value,
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async placeNftOnSale(data: Record<string, string>) {
    return this.nftModel.findOneAndUpdate(
      { tokenId: data.tokenId },
      {
        marketId: data.orderId,
        marketPaymentToken: data.paymentToken,
        marketPrice: data.price,
      },
    );
  }

  async removeNftFromSale(data: Record<string, string>) {
    return this.nftModel.findOneAndUpdate(
      { orderId: data.orderId },
      {
        marketId: null,
        marketPaymentToken: null,
        marketPrice: null,
      },
    );
  }

  async tokenBought(data: Record<string, string>) {
    return this.nftModel.findOneAndUpdate(
      { tokenId: data.tokenId },
      {
        owner: data.buyer,
      },
    );
  }

  async tokenStaked(data: Record<string, string>) {
    return this.nftModel.findOneAndUpdate(
      { tokenId: data.tokenId },
      {
        isStaked: true,
      },
    );
  }

  async tokenWithdrawn(data: Record<string, string>) {
    return this.nftModel.findOneAndUpdate(
      { tokenId: data.tokenId },
      {
        isStaked: false,
      },
    );
  }
}
