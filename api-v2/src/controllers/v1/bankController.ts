import { Request, Response, Router } from 'express';
import { check, header, validationResult } from 'express-validator';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { BankDto } from '../../dto/bank/bankDto';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { BankService } from '../../services/bankService';
import IController from './IController';

export class BankController implements IController {
  path = 'bank/';
  router: Router;
  bankService: BankService;

  constructor(router: Router) {
    this.router = router;
    this.bankService = Container.get(BankService);
  }

  initializeRoutes() {
    this.router.get('/list', this.getBankList);
    this.router.get(
      '/:bankId',
      check('bankId')
        .notEmpty()
        .withMessage(
          'bankId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      this.getBankViaId
    );
    this.router.post(
      '/',
      header('client-id').notEmpty().equals('api-v1'),
      this.uploadBanksFile
    );
  }

  getBankViaId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BANK,
            JSON.stringify(errors.array())
          )
        );
      }
      const bankId = req.params.bankId || null;
      const result = await this.bankService.getBankViaId(bankId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BANK,
            exception.message
          )
        );
      }
    }
  };

  getBankList = async (req: Request, res: Response) => {
    try {
      const result = await this.bankService.getBankList();
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BANK,
            exception.message
          )
        );
      }
    }
  };
  uploadBanksFile = async (req: any, res: Response) => {
    try {
      const result: BankDto[] = req.body?.bankList;
      const data = await this.bankService.addNewBankList(result);
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPLOAD,
            exception.message
          )
        );
      }
    }
  };
}
