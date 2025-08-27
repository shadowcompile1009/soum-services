import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { Answer, AnswerDocument } from '../models/Answer';

@Service()
export class AnswerRepository {
  async createDraftAnswer() {
    const answer = new Answer({
      next_question: null,
      description: 'Yes, minor break',
    });
    await answer.save();
    return 'Answer is created successfully';
  }

  async getAnswerViaId(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: AnswerDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await Answer.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ANSWER_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.ANSWER_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }
}
