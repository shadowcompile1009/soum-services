import Container from 'typedi';
import { Request, Response, Router } from 'express';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import IController from './IController';
import { RefundService } from '../../services/refundService';

export class RefundController implements IController {
  path = 'refund/';
  router: Router;
  refundService: RefundService;
  constructor(router: Router) {
    this.router = router;
    this.refundService = Container.get(RefundService);
  }
  initializeRoutes() {
    this.router.get('/report', this.sendDailyOrdersReport);
  }

  sendDailyOrdersReport = async (req: Request, res: Response) => {
    try {
      const [err, sendResult] = await this.refundService.sendDailyReport();
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_ORDER_EMAIL,
            sendResult.message
          )
        );
      } else {
        res.sendOk(sendResult.result, sendResult.message);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_ORDER_EMAIL,
            exception.message
          )
        );
      }
    }
  };
}
