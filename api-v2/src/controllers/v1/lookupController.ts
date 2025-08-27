import { Router } from 'express';
import IController from './IController';
import { redisCache } from '../../middleware/redisCache';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { Constants } from '../../constants/constant';
import Container from 'typedi';
import { LookupService } from '../../services/lookupService';
export class LookupController implements IController {
  path = 'lookup/';
  router: Router;
  lookupService: LookupService;
  constructor(router: Router) {
    this.router = router;
    this.lookupService = Container.get(LookupService);
  }

  initializeRoutes() {
    this.router.get('/', redisCache, this.getLookups);
  }
  getLookups = async (req: any, res: any) => {
    try {
      const result = await this.lookupService.cashAllLookups();
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
            exception.message
          )
        );
      }
    }
  };
}
