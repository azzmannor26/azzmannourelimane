import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  providers: [AllExceptionsFilter, TransformInterceptor],
  exports: [AllExceptionsFilter, TransformInterceptor],
})
export class LibsModule {}
