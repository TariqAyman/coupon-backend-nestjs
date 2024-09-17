import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { errorResponse } from '../utils/api-response-wrapper';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Error) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error';

      const isDev = this.configService.get('NODE_ENV') === 'development';

      if (isDev) console.log(exception);

      response
        .status(status)
        .json(
          errorResponse(message, status, isDev ? { exception } : undefined),
        );
    }
  }
}
