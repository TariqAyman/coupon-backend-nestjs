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
  UploadedFiles,
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
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EntityFilesInterceptor } from 'src/upload-media/entity-files.interceptor';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/coupons')
export class CouponsAdminController {
  constructor(private readonly couponsService: CouponsAdminService) {}

  @Post()
  @UseInterceptors(
    EntityFilesInterceptor('coupon', [
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles() files: { [fieldName: string]: Express.Multer.File[] },
    @Body() createCouponDto: CreateCouponDto,
  ) {
    const coupon = await this.couponsService.create(createCouponDto, files);
    return showOne(coupon);
  }

  @Get()
  async findAll(@Query() pagination: PaginationOptionsDto) {
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
  @UseInterceptors(
    EntityFilesInterceptor('coupon', [
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
    @UploadedFiles() files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const response = await this.couponsService.update(
      id,
      updateCouponDto,
      files,
    );

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponsService.remove(id);
    return success([]);
  }
}
