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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/UserRole';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CategoriesAdminService } from './categories-admin.service';
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
import { EntityFilesInterceptor } from 'src/upload-media/entity-files.interceptor';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/categories')
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesAdminService) {}

  @Post()
  @UseInterceptors(
    EntityFilesInterceptor('category', [
      { name: 'image', maxCount: 1 },
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles() files: { [fieldName: string]: Express.Multer.File[] },
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const category = await this.categoriesService.create(
      createCategoryDto,
      files,
    );
    return success(category);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.categoriesService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.categoriesService.findOne(id);
    return success(response);
  }

  @Patch(':id')
  @UseInterceptors(
    EntityFilesInterceptor('category', [
      { name: 'image', maxCount: 1 },
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFiles() files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const response = await this.categoriesService.update(
      id,
      updateCategoryDto,
      files,
    );

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return success([]);
  }
}
