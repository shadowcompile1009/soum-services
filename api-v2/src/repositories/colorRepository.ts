import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { Color } from '../models/Color';
import { BaseRepository } from './BaseRepository';

@Service()
export class ColorRepository extends BaseRepository {
  async getById(id: any) {
    try {
      const data = await Color.findById(id).exec();
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_COLOR];
    }
  }
  async getColors() {
    try {
      const data = await Color.find().exec();
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_COLOR];
    }
  }
}
