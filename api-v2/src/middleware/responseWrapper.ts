import { Request, Response } from 'express';
import _isEmpty from 'lodash/isEmpty';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { responseTemplateDto } from '../dto/responseTemplateDto';
import { ViolationDto } from '../dto/violationDto';
import { ErrorService } from '../services/errorService';
import logger from '../util/logger';

export const responseWrapper = (req: Request, res: Response, next: any) => {
  const errService = new ErrorService();

  res.sendError = function (err: any) {
    let message =
      err != null && err.hasOwnProperty('message') ? err.message : null;
    const violations = [];
    const errCode = err.errorCode || Constants.ERROR_CODE.BAD_REQUEST;

    if (err instanceof ErrorResponseDto) {
      const errCodeMessage = errService.getMessage(
        err.errorCode,
        err.errorType,
        err.errorKey
      );
      if (errCodeMessage) {
        violations.push(new ViolationDto(err.errorCode, errCodeMessage));
      }
    }

    if (!_isEmpty(err.errorDetail)) {
      if (!(err.errorDetail instanceof Error)) {
        err.errorDetail = new Error(err.errorDetail);
      }
      message = err.errorDetail.message;
      if (!_isEmpty(req.body)) {
        if (![401, 403, 400, 429].includes(Number(err.errorCode))) {
          logger.error({
            method: req.method,
            url: req.originalUrl,
            requestBody: req.body,
          });
        }
      }
      if (![401, 403, 400, 429].includes(Number(err.errorCode))) {
        logger.error(err.errorDetail);
      }
    } else {
      if (![401, 403, 400, 429].includes(Number(err.errorCode))) {
        logger.error(err);
      }
    }

    if (violations.length == 0) {
      violations.push(
        new ViolationDto(
          Constants.DEFAULT_ERROR_CODE,
          errService.getMessage(
            Constants.DEFAULT_ERROR_CODE,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEFAULT_KEY_ERROR
          )
        )
      );
    }

    const data = err?.resData ? err.resData : null;

    res.status(errCode).send(responseTemplateDto(data, message, violations));
  };

  res.sendOk = function (data: any, message: any = null) {
    res
      .status(Constants.SUCCESS_CODE.SUCCESS)
      .send(responseTemplateDto(data, message, null));
  };

  res.sendCreated = (data: any, message: any = null) => {
    res.status(201).send(responseTemplateDto(data, message, null));
  };
  res.status(Constants.ERROR_CODE.BAD_REQUEST);
  next();
};
