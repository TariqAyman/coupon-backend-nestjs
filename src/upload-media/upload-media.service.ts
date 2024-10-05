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
    isFileRequired: boolean = true,
  ): Promise<UploadMedia> {
    if (isFileRequired && !file) {
      throw new Error('File is required');
    }

    const uploadDir = `public/storage/uploads/${entityType}`;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFilename = file.filename;
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

  async saveOneFile(
    file: Express.Multer.File[] | Express.Multer.File | undefined,
    entityType: string,
    entityId: string,
    isFileRequired: boolean = true,
  ): Promise<UploadMedia | undefined> {
    if (Array.isArray(file)) {
      file = file[0];
    }

    if (file === undefined) {
      return undefined;
    }

    return await this.saveFileData(file, entityType, entityId, isFileRequired);
  }

  async saveFiles(
    file: Express.Multer.File[] | Express.Multer.File | undefined,
    entityType: string,
    entityId: string,
    count: number = 1,
    isFileRequired: boolean = true,
  ): Promise<UploadMedia | UploadMedia[] | undefined> {
    if (file === undefined) {
      return undefined;
    } else if (Array.isArray(file)) {
      const files = file.map((f) =>
        this.saveFileData(f, entityType, entityId, isFileRequired),
      );
      return Promise.all(files);
    } else if (file instanceof File) {
      return await this.saveFileData(
        file,
        entityType,
        entityId,
        isFileRequired,
      );
    }

    return undefined;
  }

  async deleteFile(id: string | undefined, filePath: string): Promise<boolean> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  }
}
