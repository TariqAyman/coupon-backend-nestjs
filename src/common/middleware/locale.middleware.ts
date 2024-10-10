// locale.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class LocaleMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  use(req: Request, res: Response, next: NextFunction) {
    const locale = req.headers['locale'] || 'en'; // Get locale from the request header or use 'en' as default

      console.log('mid-locale', locale);
    // Inject the locale into TypeORM's extra options for the current request
    // this.dataSource.options.extra = {
    //   locale,
    // };

    next();
  }
}
