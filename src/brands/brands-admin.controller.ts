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
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandsAdminService } from './brands-admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/UserRole';
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

@Controller('admin/brands')
@UseGuards(RolesGuard, JwtAuthGuard)
@Roles(UserRole.Admin)
export class BrandsAdminController {
  constructor(private readonly brandsService: BrandsAdminService) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandsService.create(createBrandDto);
    return success(brand);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.brandsService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.brandsService.findOne(id);
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
    updateBrandDto: UpdateBrandDto,
  ) {
    const response = await this.brandsService.update(id, updateBrandDto);

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.brandsService.remove(id);
    return success([]);
  }
}
