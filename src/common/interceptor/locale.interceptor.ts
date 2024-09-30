import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LocaleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const locale =
      request.query.locale ||
      request.headers['accept-language'] ||
      request.headers['Accept-Language'] ||
      'en';
    request.locale = locale;
    return next.handle();
  }
}
