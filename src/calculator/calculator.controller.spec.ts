import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import { BadRequestException } from '@nestjs/common';

describe('CalculatorController', () => {
  let controller: CalculatorController;
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalculatorController],
      providers: [CalculatorService],
    }).compile();

    controller = module.get<CalculatorController>(CalculatorController);
    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the correct result for a valid expression', () => {
    const result = controller.evaluate({
      expression: '(1-1)*2+3*(1-3+4)+10/2',
    });
    expect(result).toEqual({ result: 11 });
  });

  it('should throw BadRequestException for an empty expression', () => {
    expect(() => controller.evaluate({ expression: '' })).toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for an invalid expression', () => {
    jest.spyOn(service, 'evaluateExpression').mockImplementation(() => {
      throw new BadRequestException('Invalid expression');
    });
    expect(() => controller.evaluate({ expression: '1++1' })).toThrow(
      BadRequestException,
    );
  });
});
