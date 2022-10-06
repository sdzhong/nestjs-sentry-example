import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TraceMiddleware } from './trace.middleware';

@Module({
  imports: [
    SentryModule.forRoot({
      enabled: true,
      debug: true,
      dsn:
        'https://x@x.ingest.sentry.io/x',
      logLevel: LogLevel.Debug,
      environment: 'development',
      tracesSampleRate: 1.0,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
