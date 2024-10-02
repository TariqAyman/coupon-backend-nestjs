import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-config';

export function EntityFilesInterceptor(
  entityType: string,
  uploadFields: Array<{ name: string; maxCount?: number }>,
): Type<NestInterceptor> {
  const multerOpts = multerOptions(entityType);

  class MixinInterceptor implements NestInterceptor {
    protected fileFieldsInterceptor;

    constructor() {
      this.fileFieldsInterceptor = new (FileFieldsInterceptor(
        uploadFields,
        multerOpts,
      ))();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      return this.fileFieldsInterceptor.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}
