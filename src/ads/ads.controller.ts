import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdsService } from './ads.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.adsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }
}
