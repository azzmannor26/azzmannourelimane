import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerService } from './logger';

@Module({
  providers: [AllExceptionsFilter, TransformInterceptor, LoggerService],
  exports: [AllExceptionsFilter, TransformInterceptor, LoggerService],
})
export class LibsModule {}
