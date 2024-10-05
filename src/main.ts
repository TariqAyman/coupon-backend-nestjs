import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { LocaleInterceptor } from './common/interceptor/locale.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { useContainer, ValidationError } from 'class-validator';
import { handleError } from './common/utils/api-response-wrapper';
import { connectionSource } from './database/typeorm.config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  await connectionSource.initialize();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app use global pipes to automatically validate requests
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enables automatic data transformation
      whitelist: true, // Strips properties without decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transformOptions: { enableImplicitConversion: true },
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

  app.useStaticAssets(join(__dirname, '..', 'public/storage/uploads'), {
    prefix: '/public/storage/uploads/',
  });

  await app.listen(3000);
}
bootstrap();
