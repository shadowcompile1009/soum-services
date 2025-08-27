export class ViolationsDto {
  public code: number;
  public message: string;
  public action: any;
  constructor(code?: number, message?: string, action?: any) {
    this.code = code;
    this.message = message;
    this.action = action;
  }
}
