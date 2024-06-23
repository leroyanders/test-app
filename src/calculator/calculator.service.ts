import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CalculatorService {
  evaluateExpression(expression: string): number {
    try {
      const sanitizedExpression = this.sanitizeExpression(expression);
      this.validateExpression(sanitizedExpression);
      return this.evaluate(sanitizedExpression);
    } catch (error) {
      throw new BadRequestException('Invalid expression');
    }
  }

  private sanitizeExpression(expression: string): string {
    return expression.replace(/[^-()\d/*+.]/g, '');
  }

  private validateExpression(expression: string): void {
    this.checkForInvalidSequences(expression);
    this.checkForBalancedParentheses(expression);
  }

  private checkForInvalidSequences(expression: string): void {
    const invalidSequence =
      /[^\d)][^\d(]|[*/+-]{2,}|^[*/]|[*/+-]$|[() ][^\d()*/+-]/;
    if (invalidSequence.test(expression)) {
      throw new Error('Invalid expression');
    }
  }

  private checkForBalancedParentheses(expression: string): void {
    let balance = 0;
    for (const char of expression) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) throw new Error('Invalid expression');
    }
    if (balance !== 0) throw new Error('Invalid expression');
  }

  private evaluate(expression: string): number {
    const tokens = this.tokenize(expression);
    const outputQueue = this.convertToRPN(tokens);
    return this.calculateRPN(outputQueue);
  }

  private tokenize(expression: string): string[] {
    const tokens = expression.match(/(\d+|\D)/g);
    if (!tokens) throw new Error('Invalid expression');
    return tokens;
  }

  private convertToRPN(tokens: string[]): (string | number)[] {
    const outputQueue: (string | number)[] = [];
    const operatorStack: string[] = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

    for (const token of tokens) {
      if (!isNaN(Number(token))) {
        outputQueue.push(Number(token));
      } else if ('+-*/'.includes(token)) {
        while (
          operatorStack.length &&
          precedence[operatorStack[operatorStack.length - 1]] >=
            precedence[token]
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    }

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
  }

  private calculateRPN(outputQueue: (string | number)[]): number {
    const resultStack: number[] = [];
    const applyOperator = (a: number, b: number, operator: string) => {
      switch (operator) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return a / b;
        default:
          throw new Error('Invalid operator');
      }
    };

    for (const token of outputQueue) {
      if (typeof token === 'number') {
        resultStack.push(token);
      } else {
        const b = resultStack.pop();
        const a = resultStack.pop();
        resultStack.push(applyOperator(a, b, token));
      }
    }

    return resultStack[0];
  }
}
