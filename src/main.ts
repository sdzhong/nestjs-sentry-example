import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as SentryTracing from '@sentry/tracing';

SentryTracing.addExtensionMethods();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
