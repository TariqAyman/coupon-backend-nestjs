import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-config';

export function EntityFileInterceptor(
  entityType: string,
  fieldName: string = 'uploadFile',
): Type<NestInterceptor> {
  const multerOpts = multerOptions(entityType);

  class MixinInterceptor implements NestInterceptor {
    protected filesInterceptor;

    constructor() {
      this.filesInterceptor = new (FileInterceptor(fieldName, multerOpts))();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      return this.filesInterceptor.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}
