import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { paginate } from 'src/common/utils/api-response-wrapper';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(@Query() pagination: PaginationOptionsDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.countriesService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }
}
