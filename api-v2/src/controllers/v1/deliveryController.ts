import { Response, Router } from 'express';
import { Container } from 'typedi';
import { query } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { DeliveryService } from '../../services/deliveryService';
import IController from './IController';
import { LatLong } from '../../models/Delivery';

export class DeliveryController implements IController {
  path = 'delivery/';
  router: Router;
  deliveryService: DeliveryService;
  constructor(router: Router) {
    this.router = router;
    this.deliveryService = Container.get(DeliveryService);
  }

  initializeRoutes() {
    this.router.get(
      '/coordinate-to-city',
      this.validateGetCityInput(),
      this.coordinatesToCity
    );
  }

  validateGetCityInput() {
    return [
      query('latitude')
        .isString()
        .notEmpty()
        .withMessage(
          'latitude' + Constants.VALIDATE_REQUEST_MSG.EMPTY_LATITUDE
        ),
      query('longitude')
        .isString()
        .notEmpty()
        .withMessage(
          'longitude' + Constants.VALIDATE_REQUEST_MSG.EMPTY_LONGITUDE
        ),
    ];
  }
  coordinatesToCity = async (req: any, res: Response) => {
    try {
      const latitude = +req.query.latitude;
      const longitude = +req.query.longitude;
      const coordinates: LatLong = {
        latitude: latitude,
        longitude: longitude,
      };
      const result = await this.deliveryService.coordinatesToCity(coordinates);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CITY,
            exception.message
          )
        );
      }
    }
  };
}
