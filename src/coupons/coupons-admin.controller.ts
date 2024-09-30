import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  Req,
  Request,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/UserRole';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CouponsAdminService } from './coupons-admin.service';
import {
  paginate,
  showOne,
  success,
} from 'src/common/utils/api-response-wrapper';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  BodyWithParam,
  transformToTypeTypes,
} from 'src/common/decorators/body-with-param.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JsonToObjectsInterceptor } from 'src/common/interceptor/json-to-objects.interceptor';

@Controller('admin/coupons')
@UseGuards(RolesGuard, JwtAuthGuard)
@Roles(UserRole.Admin)
export class CouponsAdminController {
  constructor(private readonly couponsService: CouponsAdminService) {}

  @Post()
  async create(@Body() createCouponDto: CreateCouponDto) {
    console.log(createCouponDto);
    const coupon = await this.couponsService.create(createCouponDto);
    return showOne(coupon);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.couponsService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.couponsService.findOne(id);
    return showOne(response);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @BodyWithParam({
      paramName: 'id',
      transformTo: transformToTypeTypes.STRING,
    })
    @Body()
    updateCouponDto: UpdateCouponDto,
  ) {
    const response = await this.couponsService.update(id, updateCouponDto);

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponsService.remove(id);
    return success([]);
  }
}
