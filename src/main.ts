import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { LocaleInterceptor } from './common/interceptor/locale.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { useContainer, ValidationError } from 'class-validator';
import { handleError } from './common/utils/api-response-wrapper';
import { connectionSource } from './database/typeorm.config';

async function bootstrap() {
  await connectionSource.initialize();

  const app = await NestFactory.create(AppModule);

  // app use global pipes to automatically validate requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.reduce(
          (acc: Record<string, string[]>, err) => {
            acc[err.property] = err.constraints
              ? Object.values(err.constraints)
              : ['Invalid value'];
            return acc;
          },
          {},
        );

        return handleError(formattedErrors, HttpStatus.BAD_REQUEST);
      },
    }),
  );

  app.useGlobalInterceptors(new LocaleInterceptor());

  // const allExceptionsFilter = app.get(AllExceptionsFilter);
  // app.useGlobalFilters(allExceptionsFilter);

  // wrap AppModule with UseContainer
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
