import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { PaginateModel, PaginateOptions } from 'mongoose';
import { FindQueryResult } from '../../common/decorators/request';
import { PaymentToken, PaymentTokenDocument } from './payment-token.schema';

@Injectable()
export class PaymentTokenService {
  private readonly logger = new Logger(PaymentTokenService.name);

  constructor(
    @InjectModel(PaymentToken.name)
    private readonly paymentTokenModel: PaginateModel<PaymentTokenDocument>,
  ) {}
  async getPaymentTokens(findQuery: FindQueryResult) {
    const options: PaginateOptions = {
      ...findQuery.pagination,
      select: '-__v -_id',
    };
    return this.paymentTokenModel.paginate(findQuery.filters, options);
  }

  async upsertPaymentToken(data: Record<string, string>) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      data.paymentToken_,
      [
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
      ],
      provider,
    );
    const [tokenSymbol, tokenDecimals] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
    ]);
    return this.paymentTokenModel.findOneAndUpdate(
      {
        tokenAddress: data.paymentToken_,
      },
      {
        tokenAddress: data.paymentToken_,
        tokenSymbol,
        tokenDecimals,
      },
      {
        upsert: true,
      },
    );
  }
}
