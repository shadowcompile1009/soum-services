import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(code: string) {
    super(code || 'Not Found', HttpStatus.BAD_REQUEST);
  }
}
