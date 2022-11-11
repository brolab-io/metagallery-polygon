import { Module } from '@nestjs/common';
import { CollectionModule } from '../collections/collection.module';
import { NftModule } from '../nfts/nft.module';
import { PaymentTokenModule } from '../payment-token/payment-token.module';
import { HookController } from './hook.controller';
import { HookService } from './hook.service';

@Module({
  imports: [CollectionModule, NftModule, PaymentTokenModule],
  controllers: [HookController],
  providers: [HookService],
})
export class HookModule {}
