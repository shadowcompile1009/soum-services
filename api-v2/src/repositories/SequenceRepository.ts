import { Service } from 'typedi';
import { Sequence, SequenceType } from '../models/Sequence';
import { Constants } from '../constants/constant';

@Service()
export class SequenceRepository {
  async getValueForNextSequence(
    type: SequenceType
  ): Promise<[boolean, { code: number; result: string | number }]> {
    try {
      const data = await Sequence.findOneAndUpdate(
        { type: type },
        { $inc: { sequence_value: 1 } },
        { new: true }
      );
      if (!data) {
        return [
          true,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: 'Sequence was not found',
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data.sequence_value,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: exception.message,
        },
      ];
    }
  }
}
