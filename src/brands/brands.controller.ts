import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { paginate, showOne } from 'src/common/utils/api-response-wrapper';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { JwtAuthOrGuestGuard } from 'src/common/guards/jwt-auth-or-guest.guard';

@UseGuards(JwtAuthOrGuestGuard)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query() pagination: PaginationOptionsDto,
  ) {
    const { data, total, pageNumber, limitNumber } =
      await this.brandsService.findAll(pagination, req.user?.id);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const response = await this.brandsService.findOne(id, req.user?.id);
    return showOne(response);
  }
}
