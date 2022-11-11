import { Controller, Get, Param } from '@nestjs/common';
import { FindQuery, FindQueryResult } from '../../common/decorators/request';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  getNfts(@FindQuery() findQuery: FindQueryResult) {
    return this.nftService.getNfts(findQuery);
  }

  @Get('/:field/:value')
  getNftByField(@Param('field') field: string, @Param('value') value: string) {
    return this.nftService.getNftByField(field, value);
  }
}
