import { StanderResponse } from '@src/dto/stander.response';
import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// Create the standard response
export const createStandardResponse = <T>(
  data?: T,
  message?: string,
  statusCode = HttpStatus.OK, // Default to 200 OK
  errors?: any[],
): StanderResponse<T> => {
  const success = statusCode === HttpStatus.OK ? (data ? true : false) : false; // Ensure success is always set

  const response: StanderResponse<T> = {
    success,
    statusCode,
    message,
    data,
    errors,
  };

  // If status is OK, return the result
  if (statusCode === HttpStatus.OK) {
    return response;
  }

  // If errors are provided, and the first one is a CustomError, throw it
  if (errors && errors.length > 0) {
    const error = errors[0];
    if (error instanceof HttpException) {
      throw error;
    }
  }

  // Otherwise, throw a generic CustomError
  throw new HttpException(
    {
      message: message || 'An error occurred',
      data,
      statusCode,
      errors,
      success: false,
    },
    statusCode,
  );
};
