import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { Choice, ChoiceDocument } from '../models/Choice';

@Service()
export class ChoiceRepository {
  async getChoice(
    choiceIds: string[]
  ): Promise<[boolean, ChoiceDocument[] | string]> {
    try {
      // set up new array for ids
      const choice_ids = [];
      // loop categories
      for (let c = 0; c < choiceIds.length; c++) {
        // get product id
        const choice = choiceIds[c];
        // push new ids
        choice_ids.push(new mongoose.Types.ObjectId(choice));
      }

      const choices = await Choice.find({
        _id: {
          $in: choice_ids,
        },
      })
        .select('_id score')
        .exec();
      if (!choices) {
        [true, Constants.ERROR_MAP.DATA_NOT_FOUND];
      }
      return [false, choices];
    } catch (error) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_CHOICE];
    }
  }

  async getChoiceViaId(
    id: any
  ): Promise<
    [
      boolean,
      { code: number; result: string | ChoiceDocument; message?: string }
    ]
  > {
    try {
      const data = await Choice.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_CHOICE,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_CHOICE,
          message: exception.message,
        },
      ];
    }
  }

  async getChoiceViaListId(
    choiceIdArr: string[]
  ): Promise<
    [
      boolean,
      { code: number; result: string | ChoiceDocument[]; message?: string }
    ]
  > {
    try {
      if (choiceIdArr.length === 0) {
        return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: null }];
      }
      // set up new array for ids
      const choice_ids = [];
      // loop choices
      for (let c = 0; c < (choiceIdArr || []).length; c++) {
        // get choice id
        const choice = choiceIdArr[c];
        // push new ids
        choice_ids.push(new mongoose.Types.ObjectId(choice));
      }

      const data = await Choice.find({
        _id: {
          $in: choice_ids,
        },
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_CHOICE,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_CHOICE,
          message: exception.message,
        },
      ];
    }
  }
  async getSubChoicesByIds(
    ids: string[]
  ): Promise<
    [
      boolean,
      { code: number; result: string | ChoiceDocument[]; message?: string }
    ]
  > {
    return this.getChoiceViaListId(ids);
  }
}
