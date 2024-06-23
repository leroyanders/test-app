import { Module } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculatorController } from './calculator.controller';

@Module({
  providers: [CalculatorService],
  controllers: [CalculatorController]
})
export class CalculatorModule {}
