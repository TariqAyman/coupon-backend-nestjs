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
  UploadedFiles,
  UseInterceptors,
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
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import {
  BodyWithParam,
  transformToTypeTypes,
} from 'src/common/decorators/body-with-param.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EntityFilesInterceptor } from 'src/upload-media/entity-files.interceptor';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/brands')
export class BrandsAdminController {
  constructor(private readonly brandsService: BrandsAdminService) {}

  @Post()
  @UseInterceptors(
    EntityFilesInterceptor('brand', [
      { name: 'image', maxCount: 1 },
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles() files: { [fieldName: string]: Express.Multer.File[] },
    @Body() createBrandDto: CreateBrandDto,
  ) {
    const brand = await this.brandsService.create(createBrandDto, files);
    return success(brand);
  }

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

  @Patch(':id')
  @UseInterceptors(
    EntityFilesInterceptor('brand', [
      { name: 'image', maxCount: 1 },
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { [fieldName: string]: Express.Multer.File[] },

    @Body()
    updateBrandDto: UpdateBrandDto,
  ) {
    const response = await this.brandsService.update(id, updateBrandDto, files);

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.brandsService.remove(id);
    return success([]);
  }
}
