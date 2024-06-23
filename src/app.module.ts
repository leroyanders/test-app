import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CalculatorModule } from './calculator/calculator.module';
import { LoggingInterceptor } from './logging/logging.interceptor';

@Module({
  imports: [CalculatorModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
