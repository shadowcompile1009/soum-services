import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { Capacity } from '../models/Capacity';

@Service()
export class CapacityRepository {
  async getCapacityViaId(id: any) {
    try {
      const data = await Capacity.findById(id).exec();
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_VARIANT];
    }
  }
}
