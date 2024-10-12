import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdsService } from './ads.service';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { paginate, showOne } from 'src/common/utils/api-response-wrapper';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  async findAll(@Query() pagination: PaginationOptionsDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.adsService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.adsService.findOne(id);
    return showOne(response);
  }
}
