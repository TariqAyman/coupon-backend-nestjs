import { Module } from '@nestjs/common';
import { UploadMediaService } from './upload-media.service';
import { UploadMediaController } from './upload-media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadMedia } from './entities/upload-media.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadMedia, User])],
  controllers: [UploadMediaController],
  providers: [UploadMediaService],
  exports: [UploadMediaService],
})
export class UploadMediaModule {}
