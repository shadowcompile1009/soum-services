import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateResponseDto,
  ResponseDto,
  ResponseWithScoreDto,
} from './dto/create-response.dto';
import { QuestionService } from './question.service';
import { Response } from './schemas/response.schema';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private readonly responseModel: Model<Response>,
    private readonly questionService: QuestionService,
  ) {}

  removeDuplicateResponses = (resArray) => {
    return resArray.map((item) => {
      item?.responses?.forEach((resItem) => {
        if (
          resItem.questionEn === 'Battery health' &&
          (!resItem.answers || resItem?.answers?.length === 0)
        ) {
          resItem.answers.push({
            optionEn: '100',
            optionAr: '100',
            score: 0,
            attachmentUrl: '',
            text: '',
          });
        }
      });
      const seenQuestions = new Set<string>();
      const filteredResponses = item?.responses.filter((response) => {
        const questionKey = response?.questionId;
        if (seenQuestions.has(questionKey)) {
          return false;
        }
        seenQuestions.add(questionKey);
        return true;
      });

      return { ...item, responses: filteredResponses };
    });
  };

  async getProductResponse(productId: string) {
    const aggregate: any[] = [
      {
        $match: {
          productId: productId,
        },
      },
      {
        $lookup: {
          from: 'questions',
          let: { responsesArray: '$responses' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    { questionId: '$questionId', version: '$version' },
                    {
                      $map: {
                        input: '$$responsesArray',
                        as: 'response',
                        in: {
                          questionId: '$$response.questionId',
                          version: '$$response.version',
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                sortIndex: {
                  $indexOfArray: [
                    {
                      $map: {
                        input: '$$responsesArray',
                        as: 'response',
                        in: '$$response.questionId',
                      },
                    },
                    '$questionId',
                  ],
                },
              },
            },
            { $sort: { sortIndex: 1 } },
          ],
          as: 'matchedQuestions',
        },
      },
      {
        $project: {
          userId: 1,
          productId: 1,
          score: 1,
          responses: {
            $filter: {
              input: {
                $map: {
                  input: '$responses',
                  as: 'response',
                  in: {
                    questionId: '$$response.questionId',
                    questionAr: {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: '$matchedQuestions',
                                    as: 'question',
                                    cond: {
                                      $and: [
                                        {
                                          $eq: [
                                            '$$question.questionId',
                                            '$$response.questionId',
                                          ],
                                        },
                                        {
                                          $eq: [
                                            '$$question.version',
                                            '$$response.version',
                                          ],
                                        },
                                      ],
                                    },
                                  },
                                },
                                as: 'matchedQuestion',
                                in: '$$matchedQuestion.questionAr',
                              },
                            },
                            0,
                          ],
                        },
                        '$$response.questionAr',
                      ],
                    },
                    questionEn: {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: '$matchedQuestions',
                                    as: 'question',
                                    cond: {
                                      $and: [
                                        {
                                          $eq: [
                                            '$$question.questionId',
                                            '$$response.questionId',
                                          ],
                                        },
                                        {
                                          $eq: [
                                            '$$question.version',
                                            '$$response.version',
                                          ],
                                        },
                                      ],
                                    },
                                  },
                                },
                                as: 'matchedQuestion',
                                in: '$$matchedQuestion.questionEn',
                              },
                            },
                            0,
                          ],
                        },
                        '$$response.questionEn',
                      ],
                    },
                    answers: '$$response.answers',
                  },
                },
              },
              as: 'response',
              cond: {
                $and: [
                  {
                    $ne: ['$$response.questionId', null],
                  },
                  {
                    $ne: ['$$response.questionEn', null],
                  },
                  {
                    $ne: ['$$response.questionAr', null],
                  },
                ],
              },
            },
          },
        },
      },
    ];

    const result = await this.responseModel.aggregate(aggregate).exec();

    return this.removeDuplicateResponses(result);
  }

  async calculateScore(
    createResponseDto: CreateResponseDto,
  ): Promise<{ score; transformedResponse }> {
    const transform = await Promise.all(
      createResponseDto.responses?.map(async (answer) => {
        const currentQuestion = await this.questionService.getCurrentVersion(
          answer.questionId,
        );

        if (!currentQuestion) {
          throw new NotFoundException(
            `Question with id ${answer.questionId} not found`,
          );
        }

        return {
          questionId: answer.questionId,
          version: currentQuestion.version,
          answers: answer.answers.map((a) => ({
            optionEn: a.optionEn,
            optionAr: a.optionAr,
            score: Number(
              currentQuestion.options.find(
                (o) => o.nameEn?.toLowerCase() === a.optionEn?.toLowerCase(),
              )?.score ?? 0,
            ),
            attachmentUrl: a.attachmentUrl,
            text: a.text,
          })),
        } as ResponseDto;
      }),
    );

    let score = 100;
    transform.forEach((response) => {
      response.answers.forEach((answer) => {
        score += answer.score;
      });
    });

    return { score, transformedResponse: transform };
  }

  async create(
    createResponseDto: CreateResponseDto,
  ): Promise<ResponseWithScoreDto> {
    const { score, transformedResponse } =
      await this.calculateScore(createResponseDto);
    let responseDto: ResponseWithScoreDto = null;
    if (!createResponseDto.productId) {
      responseDto = {
        ...createResponseDto,
        responses: transformedResponse,
        score,
      };

      if (score < 75) {
        throw new BadRequestException({
          message: 'Failed to list extensively used products',
          responseData: responseDto,
        });
      }

      return responseDto;
    }

    const responseData: Response = {
      userId: createResponseDto.userId,
      productId: createResponseDto.productId,
      responses: [],
      createdAt: new Date(),
    };

    responseData.responses = transformedResponse;
    responseData.score = score;

    const updatedResponse = await this.responseModel.findOneAndUpdate(
      {
        userId: createResponseDto.userId,
        productId: createResponseDto.productId,
      },
      { $set: responseData },
      { new: true, upsert: true },
    );

    if (responseData.score < 75) {
      throw new BadRequestException({
        message: 'Failed to list extensively used products',
        responseData: updatedResponse,
      });
    }

    return updatedResponse.toObject() as ResponseWithScoreDto;
  }
}
