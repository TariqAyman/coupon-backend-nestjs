import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export function multerOptions(entityType: string) {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = `./src/public/storage/uploads/${entityType}`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req: any, file: any, cb: any) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 5MB limit
    },
  };
}
