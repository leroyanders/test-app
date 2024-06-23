import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CalculatorService } from './calculator.service';

@Controller('evaluate')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post()
  evaluate(@Body() body: { expression: string }) {
    const { expression } = body;
    if (!expression) {
      throw new BadRequestException('Expression is required');
    }
    const result = this.calculatorService.evaluateExpression(expression);
    return { result };
  }
}
