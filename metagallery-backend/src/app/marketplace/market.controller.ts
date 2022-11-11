import { Controller, Get, Param } from '@nestjs/common';
import { FindQuery, FindQueryResult } from '../../common/decorators/request';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async getNFTs(@FindQuery() findQuery: FindQueryResult) {
    return await this.marketplaceService.getMarketplaceItems(findQuery);
  }

  @Get('/:field/:value')
  async getNFT(@Param('field') field: string, @Param('value') value: string) {
    return await this.marketplaceService.getMarketplaceItem(field, value);
  }
}
