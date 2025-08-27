export class StanderResponse<TData> {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: TData;
  errors?: any[]; // will update this later
}

export class StandardError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'StandardError';
    // Maintains proper stack trace in Node.js
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StandardError);
    }
  }
}
