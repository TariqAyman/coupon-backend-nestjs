import { Controller, Get, Param, Query } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { paginate, showOne } from 'src/common/utils/api-response-wrapper';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll(@Query() pagination: PaginationOptionsDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.brandsService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.brandsService.findOne(id);
    return showOne(response);
  }
}
