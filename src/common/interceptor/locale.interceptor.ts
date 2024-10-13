import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { YcI18nService } from '../yc-i18n/yc-i18n.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocaleInterceptor implements NestInterceptor {  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const locale =
      request.headers['accept-language'] ??
      request.headers['Accept-Language'] ??
      request.headers['x-language'] ??
      request.headers['x-locale'] ??
      'en';

    return next.handle();
  }
}
