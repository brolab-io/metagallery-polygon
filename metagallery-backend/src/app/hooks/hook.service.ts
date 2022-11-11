import { Injectable, Logger } from '@nestjs/common';
import Moralis from 'moralis';
import { parseLog } from '../../common/utils/logParser';
import { CollectionService } from '../collections/collection.service';
import { IWebhook } from '@moralisweb3/streams-typings';
import { HookTags } from './hook.const';
import { NftService } from '../nfts/nft.service';
import { PaymentTokenService } from '../payment-token/payment-token.service';

@Injectable()
export class HookService {
  private readonly logger = new Logger(HookService.name);

  constructor(
    private readonly collectionService: CollectionService,
    private readonly nftService: NftService,
    private readonly paymentTokenService: PaymentTokenService,
  ) {
    Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    }).then(() => {
      this.logger.log('Moralis initialized');
    });
  }

  private transformLog(log: any) {
    for (const key in log) {
      // Check if the key is a big number
      if (log[key].toString) {
        log[key] = log[key].toString();
      }
    }
    return log;
  }

  async executeHook(body: IWebhook) {
    if (body.streamId === '') {
      return this.logger.log('Hook check triggered successfully');
    }
    const decodedLogs = parseLog(body);
    if (!decodedLogs.length) {
      return this.logger.warn('No logs found');
    }
    const log = this.transformLog(decodedLogs[0]) as any;
    // Check if the hook is a new collection
    switch (body.tag) {
      case HookTags.CreateCollection:
        return this.collectionService.upsertCollection(log);
      case HookTags.MintNFT:
        return this.nftService.upsertNft(log);
      case HookTags.OrderAdded:
        return this.nftService.placeNftOnSale(log);
      case HookTags.OrderCanceled:
        return this.nftService.removeNftFromSale(log);
      case HookTags.OrderMatched:
        return this.nftService.tokenBought(log);
      case HookTags.PaymentTokenAdded:
        return this.paymentTokenService.upsertPaymentToken(log);
      case HookTags.nftStaked:
        return this.nftService.tokenStaked(log);
      case HookTags.withdrawed:
        return this.nftService.tokenWithdrawn(log);
      default:
        return {};
    }
  }

  async testHook(body: IWebhook) {
    console.log(parseLog(body));
    return parseLog(body);
  }
}
