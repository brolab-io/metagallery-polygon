import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionModule } from './app/collections/collection.module';
import { HookModule } from './app/hooks/hook.module';
import { MarketplaceModule } from './app/marketplace/marketplace.module';
import { NftModule } from './app/nfts/nft.module';
import { PaymentTokenModule } from './app/payment-token/payment-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CollectionModule,
    NftModule,
    PaymentTokenModule,
    MarketplaceModule,
    HookModule,
  ],
})
export class AppModule {}
