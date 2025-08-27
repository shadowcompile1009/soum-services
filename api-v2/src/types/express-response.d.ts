/// <reference types="express" />

/**
 * This type definition augments existing definition
 * from @types/express
 */
declare namespace Express {
  export interface Response {
    sendError(error: any): void;
    sendOk(data: any, message?: any): void;
    sendCreated(data: any, message?: any): void;
  }
}

interface Flash {
  flash(type: string, message: any): void;
}

declare module 'express-response';
