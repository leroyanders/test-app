import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should evaluate a simple addition expression', () => {
    const result = service.evaluateExpression('1+1');
    expect(result).toBe(2);
  });

  it('should evaluate a complex expression', () => {
    const result = service.evaluateExpression('(1-1)*2+3*(1-3+4)+10/2');
    expect(result).toBe(11);
  });

  it('should throw an error for invalid expressions', () => {
    expect(() => service.evaluateExpression('1++1')).toThrow(Error);
  });

  it('should throw an error for unbalanced parentheses', () => {
    expect(() => service.evaluateExpression('((1+2)')).toThrow(Error);
  });
});
