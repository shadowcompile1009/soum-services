import { Constants } from '../constants/constant';

export class ErrorService {
  configMsg: any;
  constructor() {
    this.configMsg = Constants.ErrorConfiguration;
  }

  getMessage(errorCode: any, errorType: any, errorKey: any) {
    // Exception will be thrown if the ErrorCode + LanguageId combination is not found
    // Catch this exception and proceed to get the defaut error message
    let message;
    try {
      message = this.configMsg[errorType][errorCode][errorKey];
    } catch (exception) {
      message =
        this.configMsg[Constants.ERROR_TYPE.API][Constants.DEFAULT_ERROR_CODE][
          Constants.ERROR_MAP.DEFAULT_KEY_ERROR
        ];
    }

    return message;
  }
}
