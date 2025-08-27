import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import mongoose, { ClientSession } from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Answer, AnswerDocument, AnswerInput } from '../models/Answer';
import { Choice, ChoiceDocument, ChoiceInput } from '../models/Choice';
import { Question, QuestionDocument } from '../models/Question';

@Service()
export class QuestionRepository {
  async getQuestionById(
    questionId: string
  ): Promise<
    [
      boolean,
      { code: number; result: string | QuestionDocument; message?: string }
    ]
  > {
    try {
      const question: QuestionDocument = await Question.findById(
        questionId
      ).exec();

      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: question },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }

  async getQuestionsByIdArray(
    questionId: mongoose.Types.ObjectId[]
  ): Promise<
    [
      boolean,
      { code: number; result: string | QuestionDocument[]; message?: string }
    ]
  > {
    try {
      const question: QuestionDocument[] = await Question.find({
        _id: {
          $in: questionId,
        },
      }).exec();

      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: question },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }

  async getQuestionsByEnText(
    questionId: mongoose.Types.ObjectId[],
    textToFilter: string
  ): Promise<
    [
      boolean,
      { code: number; result: string | QuestionDocument[]; message?: string }
    ]
  > {
    try {
      const question: QuestionDocument[] = await Question.find({
        _id: {
          $in: questionId,
        },
        question_en: {
          $eq: textToFilter,
        },
      }).exec();

      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: question },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }

  async getQuestionDetailById(
    questionId: string
  ): Promise<
    [
      boolean,
      { code: number; result: string | QuestionDocument; message?: string }
    ]
  > {
    try {
      const question: QuestionDocument = await Question.findById(questionId)
        .populate({
          path: 'answers',
          populate: {
            path: 'sub_choices',
            select: { _id: 1, option_en: 1, option_ar: 1, score: 1, icon: 1 },
          },
          select: { _id: 1, order: 1, answer_en: 1, answer_ar: 1, score: 1 },
        })
        .populate('choices')
        .exec();

      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.QUESTION_GET_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: question },
      ];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async addSingleAnswer(
    obj: AnswerInput,
    session?: ClientSession
  ): Promise<AnswerDocument> {
    const newAnswer: AnswerDocument = new Answer();
    newAnswer.question_id = obj.question_id;
    newAnswer.answer_en = obj.answer_en;
    newAnswer.answer_ar = obj.answer_ar;
    newAnswer.score = obj.score;
    newAnswer.icon = obj.icon;
    return newAnswer.save(session ? { session: session } : null);
  }

  async updateSingleAnswer(
    obj: AnswerInput,
    session?: ClientSession
  ): Promise<AnswerDocument> {
    const updatingAnswer: AnswerDocument = await Answer.findById(
      obj.answer_id
    ).exec();
    if (!updatingAnswer) {
      return null;
    }
    updatingAnswer.question_id = obj.question_id;
    updatingAnswer.answer_en = obj.answer_en;
    updatingAnswer.answer_ar = obj.answer_ar;
    updatingAnswer.score = obj.score;
    updatingAnswer.icon = obj.icon;
    return updatingAnswer.save({ session: session });
  }

  async addSingleChoice(
    obj: ChoiceInput,
    session?: ClientSession
  ): Promise<ChoiceDocument> {
    const newChoice: ChoiceDocument = new Choice();
    newChoice.option_en = obj.option_en;
    newChoice.option_ar = obj.option_ar;
    newChoice.answer_id = obj.answer_id;
    newChoice.score = obj.score;
    newChoice.icon = obj.icon;
    return newChoice.save(session ? { session: session } : null);
  }

  async updateSingleChoice(
    obj: ChoiceInput,
    session?: ClientSession
  ): Promise<ChoiceDocument> {
    const updatingChoice: ChoiceDocument = await Choice.findById(
      obj.choice_id
    ).exec();
    if (!updatingChoice) {
      return null;
    }
    updatingChoice.option_en = obj.option_en;
    updatingChoice.option_ar = obj.option_ar;
    updatingChoice.answer_id = obj.answer_id;
    updatingChoice.score = obj.score;
    updatingChoice.icon = obj.icon;
    return updatingChoice.save(session ? { session: session } : null);
  }

  async addAnswer(
    obj: AnswerInput
  ): Promise<
    [
      boolean,
      { code: number; result: string | AnswerDocument; message?: string }
    ]
  > {
    try {
      const question: QuestionDocument = await Question.findById(
        obj.question_id
      ).exec();
      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.QUESTION_GET_NOT_FOUND,
          },
        ];
      }
      const newAnswer = await this.addSingleAnswer(obj);
      if (obj.sub_choices?.length > 0) {
        const choicePromises = obj.sub_choices.map((choice: ChoiceInput) => {
          const cInput: ChoiceInput = {
            answer_id: newAnswer.id,
            option_ar: choice.option_ar,
            option_en: choice.option_en,
            score: choice.score,
            icon: choice.icon,
          };

          return this.addSingleChoice(cInput);
        });

        await Promise.all(choicePromises).then((choices: ChoiceDocument[]) => {
          const ids: any = choices.map((choice: any) => {
            return choice?._id;
          });
          newAnswer.sub_choices = ids;
          newAnswer.markModified('sub_choices');
          newAnswer.save();
        });
        await newAnswer.populate('sub_choices').execPopulate();
      }

      question.answers.push(newAnswer.id);
      await question.save();
      return [
        false,
        { code: Constants.SUCCESS_CODE.CREATED, result: newAnswer },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.DUPLICATE_REQUEST,
          },
        ];
      } else {
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: exception.message },
        ];
      }
    }
  }

  async updateAnswer(
    obj: AnswerInput
  ): Promise<
    [
      boolean,
      { code: number; result: string | AnswerDocument; message?: string }
    ]
  > {
    try {
      const updateAnswer = await this.updateSingleAnswer(obj);
      if (_isEmpty(updateAnswer)) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.ANSWER_GET_NOT_FOUND,
          },
        ];
      }
      if (obj.sub_choices?.length > 0) {
        const choicePromises = obj.sub_choices.map((choice: ChoiceInput) => {
          const cInput: ChoiceInput = {
            answer_id: updateAnswer.id,
            choice_id: choice._id,
            option_ar: choice.option_ar,
            option_en: choice.option_en,
            score: choice.score,
            icon: choice.icon,
          };

          return this.updateSingleChoice(cInput);
        });

        await Promise.all(choicePromises);
        await updateAnswer.populate('sub_choices').execPopulate();
      }

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: updateAnswer },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: mappingErrorCode },
        ];
      } else {
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: exception.message },
        ];
      }
    }
  }

  async removeAnswer(
    questionId: string,
    answerId: string
  ): Promise<
    [
      boolean,
      { code: number; result: string | AnswerDocument; message?: string }
    ]
  > {
    const session = await mongoose.startSession();
    try {
      // start transaction
      session.startTransaction();
      const question: QuestionDocument = await Question.findById(
        questionId
      ).exec();
      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.QUESTION_GET_NOT_FOUND,
          },
        ];
      }
      const deletingAnswer = await Answer.findOne({ _id: answerId })
        .populate([
          {
            path: 'choices',
            select: { _id: 1 },
          },
        ])
        .exec();
      if (!deletingAnswer) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.ANSWER_GET_NOT_FOUND,
          },
        ];
      }
      const choiceIds = _map(deletingAnswer.sub_choices, '_id');
      if (choiceIds) {
        await Choice.deleteMany({ _id: { $in: choiceIds } })
          .setOptions({ session: session })
          .exec();
      }
      await deletingAnswer.deleteOne({ session: session });
      question.answers = question.answers.filter(
        item => item !== deletingAnswer.id
      ) as any;
      await question.save({ session: session });
      await session.commitTransaction();
      session.endSession();
      return [
        false,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.MESSAGE.ANSWER_REMOVED_SUCCESS,
        },
      ];
    } catch (exception) {
      // transaction rollback
      await session.abortTransaction();
      session.endSession();
      return [
        true,
        { code: Constants.ERROR_CODE.BAD_REQUEST, result: exception.message },
      ];
    }
  }

  async addChoiceAnswer(
    obj: ChoiceInput
  ): Promise<
    [boolean, { code: number; result: string | ChoiceInput; message?: string }]
  > {
    try {
      const question: QuestionDocument = await Question.findById(
        obj.question_id
      ).exec();
      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          },
        ];
      }
      const newSubChoice = await this.addSingleChoice(obj);
      question.choices.push(newSubChoice.id);
      await question.save();
      return [
        false,
        { code: Constants.SUCCESS_CODE.CREATED, result: newSubChoice },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: mappingErrorCode },
        ];
      } else {
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: exception.message },
        ];
      }
    }
  }

  async updateChoiceAnswer(
    obj: ChoiceInput
  ): Promise<
    [boolean, { code: number; result: string | ChoiceInput; message?: string }]
  > {
    try {
      const updateChoice = await this.updateSingleChoice(obj);
      if (_isEmpty(updateChoice)) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.CHOICE_GET_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: updateChoice },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: mappingErrorCode },
        ];
      } else {
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: exception.message },
        ];
      }
    }
  }

  async removeChoiceAnswer(
    questionId: string,
    choiceId: string
  ): Promise<
    [boolean, { code: number; result: string | ChoiceInput; message?: string }]
  > {
    const session = await mongoose.startSession();
    try {
      // start transaction
      session.startTransaction();
      const question: QuestionDocument = await Question.findById(
        questionId
      ).exec();
      if (!question) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.QUESTION_NOT_FOUND,
          },
        ];
      }
      const deletingChoice = await Choice.findOne({ _id: choiceId }).exec();
      if (!deletingChoice) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.CHOICE_GET_NOT_FOUND,
          },
        ];
      }

      await deletingChoice.deleteOne({ session: session });
      question.choices = question.choices.filter(
        item => item !== deletingChoice.id
      ) as any;
      await question.save({ session: session });
      await session.commitTransaction();
      session.endSession();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.CHOICE_REMOVED_SUCCESS,
        },
      ];
    } catch (exception) {
      // transaction rollback
      await session.abortTransaction();
      session.endSession();
      return [
        true,
        { code: Constants.ERROR_CODE.BAD_REQUEST, result: exception.message },
      ];
    }
  }
}
