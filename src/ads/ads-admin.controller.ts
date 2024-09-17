import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdsAdminService } from './ads-admin.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/UserRole';
import { paginate, showOne, success } from 'src/common/utils/api-response-wrapper';
import { BodyWithParam, transformToTypeTypes } from 'src/common/decorators/body-with-param.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('admin/ads')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class AdsAdminController {
  constructor(private readonly adsAdminService: AdsAdminService) {}

  @Post()
  async create(@Body() createAdDto: CreateAdDto) {
    const category = await this.adsAdminService.create(createAdDto);
    return showOne(category);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.adsAdminService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.adsAdminService.findOne(id);
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
    updateAdDto: UpdateAdDto,
  ) {
    const response = await this.adsAdminService.update(id, updateAdDto);

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.adsAdminService.remove(id);
    return success([]);
  }
}
