import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import { ClientSession } from 'mongodb';
import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Answer, AnswerDocument, AnswerInput } from '../models/Answer';
import { Brand, BrandDocument } from '../models/Brand';
import { Category, CategoryDocument } from '../models/Category';
import { Choice, ChoiceDocument, ChoiceInput } from '../models/Choice';
import { DeviceModel } from '../models/Model';
import {
  Question,
  QuestionDocument,
  QuestionInput,
  QuestionUpdateInput,
} from '../models/Question';
import {
  Questionnaire,
  QuestionnaireDocument,
  QuestionnaireInput,
} from '../models/Questionnaire';
import { Response } from '../models/Response';
import { BaseRepository } from './BaseRepository';

@Service()
export class QuestionnaireRepository extends BaseRepository {
  constructor() {
    super();
  }

  async getById(id: any): Promise<[boolean, QuestionnaireDocument | string]> {
    try {
      const data = await Questionnaire.findById(id).exec();
      return [false, data];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getQuestionnaireViaCategoryId(idCat: string) {
    try {
      const data = await Questionnaire.findOne({
        category: new mongoose.Types.ObjectId(idCat),
      }).exec();
      if (!data) {
        return [true, Constants.ERROR_MAP.QUESTIONNAIRE_NOT_FOUND];
      }
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_QUESTIONNAIRE];
    }
  }

  async getAllQuestionnaires() {
    try {
      const questionnaire = await Questionnaire.find({})
        .select(
          'description_en description_ar is_active created_date updated_date'
        )
        .populate({
          path: 'brand',
          model: Brand,
          select: 'id brand_name brand_name_ar brand_icon',
        })
        .populate({
          path: 'category',
          model: Category,
          select: 'id category_name category_name_ar category_icon',
        })
        .populate({
          path: 'device_model',
          model: DeviceModel,
          select: 'id model_name model_name_ar model_icon',
        })
        .exec();
      if (!questionnaire) {
        return [true, Constants.ERROR_MAP.QUESTIONNAIRE_NOT_FOUND];
      }
      return [false, questionnaire];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getDetailQuestionnaire(params: string | any): Promise<[boolean, any]> {
    try {
      let findQuery: any;
      if (typeof params === 'string') {
        findQuery = Questionnaire.findById(params);
      } else {
        Object.keys(params).forEach(
          k => _isEmpty(params[k]) && (params[k] = null)
        );
        findQuery = Questionnaire.find(params);
      }

      const result = await findQuery
        .populate({
          path: 'brand',
          model: Brand,
        })
        .populate({
          path: 'category',
          model: Category,
        })
        .populate({
          path: 'device_model',
          model: DeviceModel,
        })
        .populate({
          path: 'questions',
          select: {
            _id: 1,
            question_en: 1,
            question_ar: 1,
            type: 1,
            order: 1,
            question_key: 1,
            is_mandatory: 1,
            text_placeholder_en: 1,
            text_placeholder_ar: 1,
            subtext_en: 1,
            subtext_ar: 1,
          },
          populate: [
            {
              path: 'answers',
              populate: {
                path: 'sub_choices',
                select: {
                  _id: 1,
                  option_en: 1,
                  option_ar: 1,
                  score: 1,
                  icon: 1,
                  yes_answers: 1,
                  yes_question: 1,
                  no_questions: 1,
                },
              },
              select: {
                _id: 1,
                order: 1,
                answer_en: 1,
                answer_ar: 1,
                score: 1,
                yes_answers: 1,
                yes_question: 1,
                no_questions: 1,
              },
            },
            {
              path: 'choices',
              select: {
                _id: 1,
                option_en: 1,
                option_ar: 1,
                score: 1,
                icon: 1,
                yes_answers: 1,
                yes_question: 1,
                no_questions: 1,
              },
            },
          ],
        })
        .select(
          '_id description_en description_ar brand category device_model created_date updated_date'
        )
        .lean()
        .exec();

      if (result) {
        return [false, result];
      }

      return [true, Constants.ERROR_MAP.QUESTIONNAIRE_NOT_FOUND];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getMappingAnswerChoice(
    questionnaire_id: string,
    questions: string[],
    answers: string[],
    choices: string[]
  ) {
    try {
      // set up new array for ids
      const question_ids = [];
      const answer_ids = [];
      const choice_ids = [];
      // loop questions
      for (let q = 0; q < questions.length; q++) {
        // get question id
        const question = questions[q];
        // push new ids
        question_ids.push(new mongoose.Types.ObjectId(question));
      }
      // loop answers
      for (let a = 0; a < answers.length; a++) {
        //get answer id
        const answer = answers[a];
        answer_ids.push(new mongoose.Types.ObjectId(answer));
      }
      // loop choice
      for (let c = 0; c < choices.length; c++) {
        const choice = choices[c];
        choice_ids.push(new mongoose.Types.ObjectId(choice));
      }

      const questionnaire = await Questionnaire.findById(questionnaire_id)
        .populate({
          path: 'questions',
          match: {
            _id: {
              $in: question_ids,
            },
          },
          select: { _id: 1, type: 1 },
          populate: [
            {
              path: 'answers',
              match: {
                _id: {
                  $in: answer_ids,
                },
              },
              populate: {
                path: 'sub_choices',
                match: {
                  _id: {
                    $in: choice_ids,
                  },
                },
                select: { _id: 1, score: 1 },
              },
              select: { _id: 1, order: 1, score: 1 },
            },
            {
              path: 'choices',
              select: { _id: 1, score: 1 },
            },
          ],
        })
        .select('_id')
        .exec();
      if (!questionnaire) {
        return [true, Constants.ERROR_MAP.QUESTIONNAIRE_ID_NOT_FOUND];
      }
      return [false, questionnaire];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async validateQuestionnaireInput(
    obj: QuestionnaireInput
  ): Promise<[boolean, string]> {
    const existedCategory: CategoryDocument = await Category.findOne({
      _id: obj.category,
    }).exec();
    const existedBrand: BrandDocument = await Brand.findOne({
      _id: obj.brand,
    }).exec();
    const existedModel = await DeviceModel.findOne({
      _id: obj.device_model,
    }).exec();
    if (!existedBrand && !existedCategory && !existedModel) {
      return [true, 'Require at least one of category, brand, device model id'];
    }
    if (existedCategory && existedBrand && existedModel) {
      if (!existedCategory._id.equals(existedBrand.category_id) === true) {
        return [true, 'Brand is not relevant to the category'];
      }
      if (
        !existedModel.category_id.equals(existedCategory._id) ||
        !existedModel.brand_id.equals(existedBrand._id)
      ) {
        return [true, 'Device model is not relevant to category and brand'];
      }
    }
    if (
      existedCategory &&
      existedBrand &&
      !existedCategory._id.equals(existedBrand.category_id)
    ) {
      return [true, 'Brand is not relevant to the category'];
    }
    return [false, 'The input data is valid'];
  }

  async addQuestionnaire(obj: QuestionnaireInput) {
    try {
      const [validateError, message] = await this.validateQuestionnaireInput(
        obj
      );
      if (validateError) return [validateError, message];

      const questionnaire = new Questionnaire({
        brand: obj.brand ? new mongoose.Types.ObjectId(obj.brand) : null,
        category: obj.category
          ? new mongoose.Types.ObjectId(obj.category)
          : null,
        device_model: obj.device_model
          ? new mongoose.Types.ObjectId(obj.device_model)
          : null,
        description_en: obj.description_en,
        description_ar: obj.description_ar,
        is_active: obj.is_active,
      });

      const data = await questionnaire.save();
      return [false, data];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }

  async updateQuestionnaire(
    questionnaireId: string,
    updatingData: QuestionnaireInput
  ) {
    try {
      const questionnaire: QuestionnaireDocument = await Questionnaire.findById(
        questionnaireId
      ).exec();
      if (!questionnaire) {
        return [true, Constants.ERROR_MAP.QUESTIONNAIRE_NOT_FOUND];
      }
      const [validateError, message] = await this.validateQuestionnaireInput(
        updatingData
      );
      if (validateError) return [validateError, message];

      questionnaire.brand = updatingData.brand || questionnaire.brand;
      questionnaire.category = updatingData.category || questionnaire.category;
      questionnaire.device_model =
        updatingData.device_model || questionnaire.device_model;
      questionnaire.description_en =
        updatingData.description_en || questionnaire.description_en;
      questionnaire.description_ar =
        updatingData.description_ar || questionnaire.description_ar;
      await questionnaire.save();
      return [false, questionnaire];
    } catch (exception) {
      if (exception.name === 'MongoError')
        return [true, Constants.ERROR_MAP.DUPLICATE_REQUEST];
      else return [true, exception.message];
    }
  }

  async addQuestionOfQuestionnaire(obj: QuestionInput) {
    // const session = await mongoose.startSession();
    try {
      // start transaction
      // session.startTransaction();
      const question: QuestionDocument = new Question({
        questionnaire_id: obj.questionnaire_id,
        order: obj.order,
        question_en: obj.question_en,
        question_ar: obj.question_ar,
        type: obj.type,
        is_mandatory: obj.is_mandatory || false,
        text_placeholder_ar: obj.text_placeholder_ar,
        text_placeholder_en: obj.text_placeholder_en,
        subtext_ar: obj.subtext_ar,
        subtext_en: obj.subtext_en,
        question_key: obj.question_key,
      });
      await question.save();
      if (
        (question.type === 'yes-no-without-options' ||
          question.type === 'yes-no-with-options') &&
        obj.answers
      ) {
        const ansPromises = obj.answers.map((aItem: AnswerInput) => {
          const newAnswer: AnswerDocument = new Answer({
            question_id: question._id,
            answer_en: aItem.answer_en,
            answer_ar: aItem.answer_ar,
            score: aItem.score,
            icon: aItem.icon,
            yes_question: aItem.yes_question || null,
            yes_answers: aItem.yes_answers || null,
            no_questions: aItem.no_questions || null,
          });
          return newAnswer.save().then(async (savedAnswer: AnswerDocument) => {
            if (aItem.sub_choices?.length > 0) {
              const choicePromises = aItem.sub_choices.map((choice: any) => {
                const newSubChoice = new Choice({
                  answer_id: savedAnswer._id,
                  option_en: choice.option_en,
                  option_ar: choice.option_ar,
                  score: choice.score,
                  icon: choice.icon,
                  yes_answers: choice.yes_answers || null,
                  yes_question: choice.yes_question || null,
                  no_questions: choice.no_question || null,
                });
                return newSubChoice.save();
              });
              await Promise.all(choicePromises).then((choices: any) => {
                const ids = choices.map((choice: any) => {
                  return choice?._id;
                });
                savedAnswer.sub_choices = ids;
                savedAnswer.markModified('sub_choices');
                savedAnswer.save();
              });
            }
            return savedAnswer;
          });
        });

        await Promise.all(ansPromises).then((answers: any) => {
          const ids = answers.map((answer: any) => {
            return answer?._id;
          });
          question.answers = ids.filter((i: any) => i);
          question.markModified('answers');
          question.save();
        });

        await question.populate('answers').execPopulate();
      } else if (
        (question.type === 'dropdown' || question.type === 'mcqs') &&
        obj.choices?.length > 0
      ) {
        obj.choices.map((choice: any) => {
          const newChoice: ChoiceDocument = new Choice({
            option_en: choice.option_en,
            option_ar: choice.option_ar,
            score: choice.score,
            icon: choice.icon,
            yes_answers: choice.yes_answers || null,
            yes_question: choice.yes_question || null,
            no_questions: choice.no_questions || null,
          });
          newChoice.save();
          question.choices.push(newChoice._id);
        });
        question.markModified('choices');
        await question.save().then(q => q.populate('choices').execPopulate());
      }

      // await session.commitTransaction();
      // end transaction
      // session.endSession();
      return [false, question];
    } catch (exception) {
      // transaction rollback
      // await session.abortTransaction();
      // session.endSession();
      if (exception.name === 'MongoError') {
        // const mappingErrorCode = mappingMongoError(exception.code);
        return [true, exception.message];
      } else {
        return [true, exception.message];
      }
    }
  }

  async updateQuestionOfQuestionnaire(
    obj: QuestionUpdateInput,
    questionnaireId: string
  ): Promise<[boolean, QuestionDocument | string]> {
    try {
      const question: QuestionDocument = await Question.findById(
        obj.question_id
      ).exec();
      if (!question) {
        return [true, Constants.ERROR_MAP.QUESTION_NOT_FOUND];
      }
      question.questionnaire_id = new mongoose.Types.ObjectId(questionnaireId);
      question.order = obj.order;
      question.question_en = obj.question_en;
      question.question_ar = obj.question_ar;
      question.text_placeholder_ar = obj.text_placeholder_ar;
      question.text_placeholder_en = obj.text_placeholder_en;

      // Don't support to change type for now, as structure of answers and choices different
      // question.type = obj.type;
      await question.save();

      if (
        (question.type === 'yes-no-without-options' ||
          question.type === 'yes-no-with-options') &&
        obj.choices
      ) {
        await Promise.all(
          obj.answers.map(async (answer: AnswerInput) => {
            const updateAnswer: AnswerDocument = await Answer.findOne({
              _id: answer.answer_id,
              question_id: question.id,
            }).exec();
            if (!_isEmpty(updateAnswer)) {
              updateAnswer.answer_en = answer.answer_en;
              updateAnswer.answer_ar = answer.answer_ar;
              updateAnswer.score = answer.score;
              updateAnswer.icon = answer.icon;

              return updateAnswer.save().then(async (savedAnswer: any) => {
                if (answer.sub_choices?.length > 0) {
                  await answer.sub_choices.map(async (choice: any) => {
                    const updateChoice: ChoiceDocument = await Choice.findOne({
                      _id: choice.choice_id,
                      answer_id: updateAnswer.id,
                    }).exec();
                    if (!_isEmpty(updateChoice)) {
                      updateChoice.option_en = choice.option_en;
                      updateChoice.option_ar = choice.option_ar;
                      updateChoice.score = choice.score;
                      updateChoice.icon = choice.icon;
                      return updateChoice.save();
                    }
                  });
                }
                return savedAnswer;
              });
            }
          })
        );
        await question
          .populate({
            path: 'answers',
            populate: {
              path: 'sub_choices',
              select: { _id: 1, option_en: 1, option_ar: 1, score: 1, icon: 1 },
            },
            select: { _id: 1, order: 1, answer_en: 1, answer_ar: 1, score: 1 },
          })
          .execPopulate();
      } else if (
        (question.type === 'dropdown' || question.type === 'mcqs') &&
        obj.choices?.length > 0
      ) {
        await Promise.all(
          obj.choices.map(async (choice: ChoiceInput) => {
            const found = question.choices.find((item: any) =>
              item.equals(new mongoose.Types.ObjectId(choice.choice_id))
            );
            if (found) {
              const updateChoice: ChoiceDocument = await Choice.findById(
                choice.choice_id
              ).exec();
              if (!_isEmpty(updateChoice)) {
                updateChoice.option_en = choice.option_en;
                updateChoice.option_ar = choice.option_ar;
                updateChoice.score = choice.score;
                updateChoice.icon = choice.icon;
                return updateChoice.save();
              }
            }
            return;
          })
        );
        await question.populate('choices').execPopulate();
      }
      return [false, question];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }

  async removeQuestion(questionId: string) {
    // const session = await mongoose.startSession();
    try {
      // start transaction
      // session.startTransaction();
      const question = await Question.findById(questionId)
        .populate([
          {
            path: 'answers',
            select: { _id: 1 },
            populate: [
              {
                path: 'choices',
                select: { _id: 1 },
              },
            ],
          },
        ])
        .populate([
          {
            path: 'choices',
            select: { _id: 1 },
          },
        ])
        .exec();
      if (!question) {
        return [true, Constants.MESSAGE.QUESTION_GET_NOT_FOUND];
      }
      const answerIds = _map(question.answers, '_id');
      const choiceIds = _map(question.choices, '_id');
      if (answerIds) {
        await Answer.deleteMany({ _id: { $in: answerIds } }).exec();
      }
      if (choiceIds) {
        await Choice.deleteMany({ _id: { $in: choiceIds } }).exec();
      }
      await question.remove();
      // await session.commitTransaction();
      // session.endSession();
      return [false, Constants.MESSAGE.QUESTION_REMOVED_SUCCESS];
    } catch (exception) {
      // transaction rollback
      // await session.abortTransaction();
      // session.endSession();
      return [true, exception.message];
    }
  }

  async removeAllQuestionnaire(session: ClientSession) {
    try {
      await Questionnaire.deleteMany().setOptions({ session: session }).exec();
      await Question.deleteMany().setOptions({ session: session }).exec();
      await Response.deleteMany().setOptions({ session: session }).exec();
      await Answer.deleteMany().setOptions({ session: session }).exec();
      await Choice.deleteMany().setOptions({ session: session }).exec();

      return [false, 'Done to remove all questionnaire'];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async deleteQuestionnaire(questionnaireId: string) {
    await Questionnaire.deleteOne({
      _id: new mongoose.Types.ObjectId(questionnaireId),
    }).exec();
    return [true, 'Questionnaire is deleted successfully'];
  }

  async deleteImportedQuestionnaires() {
    return await Questionnaire.deleteMany({
      description_en: /Import: Questionnaire.*/,
    });
    // return await MasterQuestion.deleteMany();
  }
}
