import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UploadMediaService } from './upload-media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/UserRole';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { success } from 'src/common/utils/api-response-wrapper';
import { CreateUploadMediaDto } from './dto/create-upload-media.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EntityFileInterceptor } from './entity-file.interceptor';

@Controller('admin/upload-media')
@UseGuards(RolesGuard, JwtAuthGuard)
@Roles(UserRole.Admin)
export class UploadMediaController {
  constructor(private readonly uploadMediaService: UploadMediaService) {}

  @Post()
  @UseInterceptors(EntityFileInterceptor('media', 'uploadFile'))
  async uploadFile(
    @UploadedFile() uploadFile: Express.Multer.File,
    @Body() body: CreateUploadMediaDto,
  ) {
    console.log(uploadFile);
    const savedFile = await this.uploadMediaService.saveFileData(
      uploadFile,
      body.entityType,
      body.entityId,
    );
    return success(savedFile, 200, 'File uploaded successfully');
  }
}
