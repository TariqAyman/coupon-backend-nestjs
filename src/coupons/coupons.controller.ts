import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { paginate, showOne } from 'src/common/utils/api-response-wrapper';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { JwtAuthOrGuestGuard } from 'src/common/guards/jwt-auth-or-guest.guard';

@UseGuards(JwtAuthOrGuestGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query() pagination: PaginationOptionsDto,
  ) {
    const { data, total, pageNumber, limitNumber } =
      await this.couponsService.findAll(pagination, req.user?.id);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const coupon = await this.couponsService.findOne(id, req.user?.id);

    return showOne(coupon);
  }
}
