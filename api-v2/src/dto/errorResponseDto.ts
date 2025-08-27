import { Service } from 'typedi';
import { Constants } from '../constants/constant';

@Service()
export class ErrorResponseDto extends Error {
  errorCode: number;
  errorType: string;
  errorKey: string;
  errorDetail?: Error | string;
  resData?: { [key: string]: any };

  constructor(
    errorCode?: number,
    errorType?: string,
    errorKey?: string,
    errorDetail?: Error | string,
    resData?: { [key: string]: any }
  ) {
    // Calling parent constructor of base Error class.
    super('');

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.errorCode = errorCode || -999;
    this.errorType = errorType || Constants.ERROR_TYPE.API;
    this.errorKey = errorKey || Constants.ERROR_MAP.DEFAULT_KEY_ERROR;
    this.errorDetail = errorDetail;
    this.resData = resData;
  }
}
