import { Controller, Get, Param, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { paginate } from 'src/common/utils/api-response-wrapper';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.couponsService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }
}
