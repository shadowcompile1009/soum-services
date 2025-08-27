import Container from 'typedi';
import { Request, Response, Router } from 'express';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { HighlightService } from '../../services/HighlightService';
import IController from './IController';
import { Constants } from '../../constants/constant';

export class HighlightController implements IController {
  path = 'highlight/';
  router: Router;
  highlightService: HighlightService;
  constructor(router: Router) {
    this.router = router;
    this.highlightService = Container.get(HighlightService);
  }
  initializeRoutes() {
    this.router.put('/generate', this.generateHighlight);
  }
  generateHighlight = async (_: Request, res: Response) => {
    try {
      const result =
        await this.highlightService.generateHighlightForNewProducts();
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GENERATE_HIGHLIGHTS,
            exception.message
          )
        );
      }
    }
  };
}
