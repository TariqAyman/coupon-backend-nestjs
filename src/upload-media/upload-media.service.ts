import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadMedia } from './entities/upload-media.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadMediaService {
  constructor(
    @InjectRepository(UploadMedia)
    private filesRepository: Repository<UploadMedia>,
  ) {}

  async saveFileData(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
  ): Promise<UploadMedia> {
    console.log(file);

    if (!file) {
      throw new Error('File is required');
    }

    const uploadDir = `src/public/storage/uploads/${entityType}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueFilename).replace(/\\/g, '/');

    const newFile = this.filesRepository.create({
      url: `${process.env.BASE_URL}/${filePath}`,
      filename: uniqueFilename,
      path: filePath,
      mimetype: file.mimetype,
      size: file.size,
      entityType,
      entityId,
    });

    return await this.filesRepository.save(newFile);
  }
}
