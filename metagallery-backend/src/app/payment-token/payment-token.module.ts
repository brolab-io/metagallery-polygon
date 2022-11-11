import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentTokenController } from './payment-token.controller';
import { PaymentToken, PaymentTokenSchema } from './payment-token.schema';
import { PaymentTokenService } from './payment-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentToken.name, schema: PaymentTokenSchema },
    ]),
  ],
  controllers: [PaymentTokenController],
  providers: [PaymentTokenService],
  exports: [PaymentTokenService],
})
export class PaymentTokenModule {}
