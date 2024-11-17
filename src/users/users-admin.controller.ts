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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/common/enums/UserRole';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersAdminService } from './users-admin.service';
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
import { EntityFileInterceptor } from 'src/upload-media/entity-file.interceptor';
import {
  AddParamToBodyInterceptor,
  TransformToTypeTypes,
} from 'src/common/interceptor/add-param-to-body-interceptor';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/users')
export class UsersAdminController {
  constructor(private readonly usersService: UsersAdminService) {}

  @UseInterceptors(EntityFileInterceptor('user', 'avatar'))
  @Post()
  async create(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    const user = await this.usersService.create(createUserDto, avatar);
    return showOne(user);
  }

  @Get()
  async findAll(@Query() pagination: PaginationOptionsDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.usersService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.usersService.findOne(id);
    return showOne(response);
  }

  @Patch(':id')
  @UseInterceptors(
    new AddParamToBodyInterceptor({
      paramName: 'id',
      transformTo: TransformToTypeTypes.string,
    }),
  )
  @UseInterceptors(EntityFileInterceptor('user', 'avatar'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const response = await this.usersService.update(
      updateUserDto.id,
      updateUserDto,
      avatar,
    );

    return showOne(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return success([]);
  }
}
