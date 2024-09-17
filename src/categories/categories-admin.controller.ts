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

@Controller('admin/categories')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesAdminService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
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
  async update(
    @Param('id') id: string,
    @BodyWithParam({
      paramName: 'id',
      transformTo: transformToTypeTypes.STRING,
    })
    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const response = await this.categoriesService.update(id, updateCategoryDto);

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return success([]);
  }
}
