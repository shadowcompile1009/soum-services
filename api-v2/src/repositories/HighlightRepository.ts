import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { HighlightDocument, Highlight } from '../models/Highlight';

@Service()
export class HighlightRepository {
  async getAll(): Promise<
    [
      boolean,
      { code: number; result: HighlightDocument[] | string; message?: string }
    ]
  > {
    try {
      const data: HighlightDocument[] = await Highlight.find({}).exec();
      if (!data || data.length <= 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_HIGHLIGHTS,
            message: Constants.MESSAGE.FAILED_TO_GET_HIGHLIGHTS,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_HIGHLIGHTS,
          message: exception.message,
        },
      ];
    }
  }
}
