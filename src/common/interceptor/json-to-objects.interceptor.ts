import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export function JsonToObjectsInterceptor(
  fields: string[],
): Type<NestInterceptor> {
  class JsonToObjectsInterceptorClass implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      console.log(fields,request.body);

      if (request.body) {
        fields.forEach((field) => {
          if (request.body[field]) {
            console.log(request.body[field]);
            request.body[field] = JSON.parse(request.body[field]);
          }
        });
      }
      return next.handle();
    }
  }
  const Interceptor = mixin(JsonToObjectsInterceptorClass);
  return Interceptor as Type<NestInterceptor>;
}
