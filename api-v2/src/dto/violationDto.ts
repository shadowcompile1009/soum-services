export class ViolationDto {
  code: any;
  message: any;
  action: any;

  constructor(code: any, message: any, action: any = null) {
    this.code = code;
    this.message = message;
    this.action = action;
  }
}
