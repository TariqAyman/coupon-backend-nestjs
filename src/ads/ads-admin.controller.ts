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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AdsAdminService } from './ads-admin.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/UserRole';
import {
  paginate,
  showOne,
  success,
} from 'src/common/utils/api-response-wrapper';
import {
  BodyWithParam,
  transformToTypeTypes,
} from 'src/common/decorators/body-with-param.decorator';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EntityFilesInterceptor } from 'src/upload-media/entity-files.interceptor';
import { EntityFileInterceptor } from 'src/upload-media/entity-file.interceptor';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/ads')
export class AdsAdminController {
  constructor(private readonly adsAdminService: AdsAdminService) {}

  @Post()
  @UseInterceptors(
    EntityFilesInterceptor('ads', [
      { name: 'image', maxCount: 1 },
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles() files: { [fieldName: string]: Express.Multer.File[] },
    @Body() createAdDto: CreateAdDto,
  ) {
    const ads = await this.adsAdminService.create(createAdDto, files);
    return showOne(ads);
  }

  @Get()
  async findAll(@Query() pagination: PaginationOptionsDto) {
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
  @UseInterceptors(
    EntityFilesInterceptor('ads', [
      { name: 'image', maxCount: 1 },
      { name: 'ogImage', maxCount: 1 },
      { name: 'twitterImage', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateAdDto: UpdateAdDto,
    @UploadedFiles() files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const response = await this.adsAdminService.update(id, updateAdDto, files);

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.adsAdminService.remove(id);
    return success([]);
  }
}
