import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { Model, Types } from 'mongoose';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Questionnaire,
  QuestionnaireStatus,
} from './schemas/questionnaire.schema';
import { QuestionStatus } from './schemas/question.schema';
import { getCache, setCache, deleteWithPattern } from '@src/utils/redis';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
  ) {}
  create(
    createQuestionnaireDto: CreateQuestionnaireDto,
  ): Promise<Questionnaire> {
    const questionnaireData = {
      descriptionEn: createQuestionnaireDto.descriptionEn,
      descriptionAr: createQuestionnaireDto.descriptionAr,
      status: createQuestionnaireDto.status || QuestionnaireStatus.Active,
      categoryId: createQuestionnaireDto.categoryId,
      categoryName: createQuestionnaireDto.categoryName,
      questions: createQuestionnaireDto.questions,
    };

    const questionnaire = new this.questionnaireModel(questionnaireData);
    return questionnaire.save();
  }

  async update(
    id: Types.ObjectId,
    updateQuestionnaireDto: UpdateQuestionnaireDto,
  ) {
    const questionnaire = await this.findOne(id);
    if (!questionnaire) {
      throw new Error('Questionnaire not found');
    }

    questionnaire.descriptionEn = updateQuestionnaireDto.descriptionEn;
    questionnaire.descriptionAr = updateQuestionnaireDto.descriptionAr;
    const updateQuestions = new Map(
      updateQuestionnaireDto.questions.map((q, index) => [
        q.questionId,
        { ...q, order: index + 1 },
      ]),
    );

    questionnaire.questions = questionnaire.questions
      .map((question) => {
        const found = updateQuestions.get(question.questionId);
        return found ? { ...question, ...found } : question;
      })
      .sort((q1, q2) => q1.order - q2.order);

    await deleteWithPattern(`questionnaires-${questionnaire.categoryId}-*`);

    return this.questionnaireModel.findByIdAndUpdate(id, questionnaire, {
      new: true,
    });
  }

  async findAll(
    categoryId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ questionnaires: Questionnaire[]; count: number }> {
    const pSize = pageSize;
    const pNumber = page;
    const query = { status: QuestionnaireStatus.Active };
    const searchQuery = {
      categoryId: categoryId,
    };
    const cacheKey = `questionnaires-${categoryId}-${pSize}-${pNumber}`;
    const cachedResult: any = await getCache(cacheKey);
    if (cachedResult) {
      return {
        questionnaires: cachedResult.questionnaires,
        count: cachedResult.count,
      };
    }

    Object.assign(query, searchQuery);

    const options = {
      limit: pSize,
      offset: (pNumber - 1) * pSize,
    };

    const result = await this.questionnaireModel
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'questions',
            let: { questionsArray: '$questions' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$status', QuestionStatus.Active] },
                      { $in: ['$questionId', '$$questionsArray.questionId'] },
                    ],
                  },
                },
              },
              {
                $addFields: {
                  sortIndex: {
                    $indexOfArray: [
                      '$$questionsArray.questionId',
                      '$questionId',
                    ],
                  },
                },
              },
              { $sort: { sortIndex: 1 } },
            ],
            as: 'activeQuestions',
          },
        },
        {
          $addFields: {
            questions: {
              $slice: ['$activeQuestions', options.offset, options.limit],
            },
            totalQuestions: { $size: '$activeQuestions' },
          },
        },
        {
          $project: {
            questions: 1,
            totalQuestions: 1,
            createdAt: 1,
            updatedAt: 1,
            categoryId: 1,
            categoryName: 1,
            status: 1,
            questionId: 1,
            descriptionEn: 1,
            descriptionAr: 1,
          },
        },
      ])
      .sort({ createdAt: 1 })
      .exec();

    if (!result || result.length == 0) {
      return { questionnaires: [], count: 0 };
    }
    const returnData = {
      questionnaires: result,
      count: result[0]?.totalQuestions || 0,
    };
    await setCache(cacheKey, returnData);

    return returnData;
  }

  async findOne(id: Types.ObjectId): Promise<Questionnaire> {
    const result = await this.questionnaireModel
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: 'questions',
            let: { questionArray: '$questions' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$status', QuestionStatus.Active] },
                      { $in: ['$questionId', '$$questionArray.questionId'] },
                    ],
                  },
                },
              },
              {
                $addFields: {
                  sortIndex: {
                    $indexOfArray: [
                      '$$questionArray.questionId',
                      '$questionId',
                    ],
                  },
                },
              },
              {
                $sort: { sortIndex: 1 },
              },
            ],
            as: 'activeQuestions',
          },
        },
        {
          $addFields: {
            questions: '$activeQuestions',
          },
        },
        {
          $project: {
            questions: 1,
            categoryId: 1,
            categoryName: 1,
            status: 1,
            descriptionEn: 1,
            descriptionAr: 1,
            createdAt: 1,
            updatedAt: 1,
            deletedAt: 1,
          },
        },
      ])
      .exec();

    return result[0] as Questionnaire;
  }
}
