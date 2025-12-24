import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES } from './constants/EMessage';
import { ErrorResponseBuilder } from '../utils/error/errorResponseBuilder';

describe('ErrorResponseBuilder', () => {
  it('returns unauthorized message for UnauthorizedException', () => {
    const response = ErrorResponseBuilder.build(new UnauthorizedException(), 'req-1');

    expect(response.success).toBe(false);
    expect(response.message).toBe(ERROR_MESSAGES.UNAUTHORIZED);
    expect(response.errorCode).toBe(401);
    expect(response.requestId).toBe('req-1');
    expect(response.timestamp).toEqual(expect.any(Number));
  });

  it('joins validation messages from BadRequestException payload', () => {
    const error = new BadRequestException({ message: ['field is required', 'must be a number'] });
    const response = ErrorResponseBuilder.build(error, 'req-2');

    expect(response.message).toBe('field is required, must be a number');
    expect(response.errorCode).toBe(400);
  });

  it('falls back to default message for non-HTTP errors', () => {
    const response = ErrorResponseBuilder.build(new Error('Unexpected failure'), 'req-3');

    expect(response.message).toBe(ERROR_MESSAGES.DEFAULT);
    expect(response.errorCode).toBe(500);
    expect(response.stack).toEqual(expect.any(String));
  });
});
