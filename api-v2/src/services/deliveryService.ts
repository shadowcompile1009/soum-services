/* eslint-disable max-len */
import { Service } from 'typedi';
import axios from 'axios';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { LatLong } from '../models/Delivery';

@Service()
export class DeliveryService {
  constructor(private error: ErrorResponseDto) {}

  async coordinatesToCity(value: LatLong) {
    try {
      if (!value) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }

      const url = `${process.env.MAPS_URL}lat=${value.latitude}&lon=${value.longitude}&accept-language=en`;

      const response = await axios.get(url, { timeout: 2000 });
      if (response.statusText === 'OK') {
        const city = response.data.address.city
          ? response.data.address.city
          : response.data.address.province;
        return {
          city: city,
        };
      }
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_CITY
      );
    }
  }
}
