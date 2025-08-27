import { Service } from 'typedi';
import mongoose from 'mongoose';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { AnswerDocument } from '../models/Answer';
import { ChoiceDocument } from '../models/Choice';
import { AnswerToQuestion } from '../models/LegacyProducts';
import { QuestionDocument, QuestionKey } from '../models/Question';
import {
  AnswerResponseOutput,
  ChoiceResponseOutput,
  ItemAnswerInput,
  ResponseInput,
  ResponseOutput,
  ResponseType,
} from '../models/Response';
import { AnswerRepository } from '../repositories/answerRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { ProductRepository } from '../repositories/productRepository';
import { QuestionnaireRepository } from '../repositories/questionnaireRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ResponseRepository } from '../repositories/responseRepository';
import { UserRepository } from '../repositories/userRepository';
import { UserLegacyDocument } from '../models/LegacyUser';
// import { IChoice } from "../models/Choice";

@Service()
export class ResponseService {
  constructor(
    public error?: ErrorResponseDto,
    public responseRepository?: ResponseRepository,
    public choiceRepository?: ChoiceRepository,
    public questionnaireRepository?: QuestionnaireRepository,
    public productRepository?: ProductRepository,
    public questionRepository?: QuestionRepository,
    public answerRepository?: AnswerRepository,
    public userRepository?: UserRepository
  ) {}

  async retrieveMappingChoice(
    responseChoice: any,
    returnedResponse: ResponseOutput
  ) {
    try {
      let choiceIds = responseChoice;
      let newFormat = false;
      if (responseChoice && typeof responseChoice[0] === 'object') {
        choiceIds = responseChoice.map((item: any) => item.id);
        newFormat = true;
      }
      returnedResponse.choices = [];
      const [errChoice, choices] =
        await this.choiceRepository.getChoiceViaListId(choiceIds);
      if (errChoice) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = choices.result.toString();
        this.error.message = choices.message || '';
        throw this.error;
      }
      const data = choices.result as ChoiceDocument[];
      for (let c = 0; c < (data || []).length; c++) {
        const choice = data[c];
        const returnedChoice: ChoiceResponseOutput = {
          choice_id: choice._id,
          option_ar: newFormat
            ? responseChoice.find((i: any) => i.id === choice._id?.toString())
                ?.value
            : choice.option_ar,
          option_en: newFormat
            ? responseChoice.find((i: any) => i.id === choice._id?.toString())
                ?.value
            : choice.option_en,
          icon: choice.icon,
          score: choice.score,
          position_en: choice?.position_en,
          position_ar: choice?.position_ar,
        };
        returnedResponse.choices.push(returnedChoice);
      }
      return returnedResponse;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
          exception.message
        );
      }
    }
  }

  async retrieveMappingSubchoice(
    sub_choiceIds: any,
    returnedAnswer: AnswerResponseOutput
  ) {
    try {
      const [errSubChoice, sub_choices] =
        await this.choiceRepository.getSubChoicesByIds(sub_choiceIds);
      if (errSubChoice) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = sub_choices.result.toString();
        this.error.message = sub_choices.message || '';
        throw this.error;
      }
      for (let s = 0; s < (sub_choices.result || []).length; s++) {
        const sub_choice = sub_choices.result[s] as ChoiceDocument;
        const returnedSubChoice: ChoiceResponseOutput = {
          choice_id: sub_choice._id,
          option_ar: sub_choice.option_ar,
          option_en: sub_choice.option_en,
          icon: sub_choice.icon,
          score: sub_choice.score,
          position_en: sub_choice?.position_en,
          position_ar: sub_choice?.position_ar,
        };
        returnedAnswer.sub_choices.push(returnedSubChoice);
      }
      return returnedAnswer;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
          'retrieveMappingSubchoice'
        );
      }
    }
  }

  async retrieveMappingAnswer(
    responseAns: any,
    returnedResponse: ResponseOutput
  ) {
    try {
      returnedResponse.answers = [];
      for (let a = 0; a < responseAns.length; a++) {
        const answerId = responseAns[a].answer_id;
        if (!answerId) {
          continue;
        }
        const [errAns, answer] = await this.answerRepository.getAnswerViaId(
          answerId
        );
        if (errAns) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = answer.result.toString();
          this.error.message = answer.message || '';
          throw this.error;
        }
        let returnedAnswer: AnswerResponseOutput = {
          answer_id: (answer.result as AnswerDocument)._id,
          answer_en: (answer.result as AnswerDocument).answer_en,
          answer_ar: (answer.result as AnswerDocument).answer_ar,
          icon: (answer.result as AnswerDocument).icon,
          score: (answer.result as AnswerDocument).score,
          sub_choices: [],
        };
        const sub_choiceIds = responseAns[a].sub_choices || [];
        if (sub_choiceIds.length > 0) {
          returnedAnswer = await this.retrieveMappingSubchoice(
            sub_choiceIds,
            returnedAnswer
          );
        }
        returnedResponse.answers.push(returnedAnswer);
      }
      return returnedResponse;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
          exception.message
        );
      }
    }
  }

  async mappingMultipleChoiceInSameAnswer(
    foundAnswerArr: ResponseOutput,
    itemResponse: any
  ) {
    try {
      for (let a = 0; a < (foundAnswerArr.answers || []).length; a++) {
        const answerId = foundAnswerArr.answers[a].answer_id || '';
        const foundAnswerId = itemResponse.answer_ids.find(
          (item: any) =>
            (item.answer_id || '').toString() === answerId.toString()
        );
        if (foundAnswerId) {
          const subChoiceArr = foundAnswerId.sub_choices || [];
          const [errSubChoice, data] =
            await this.choiceRepository.getChoiceViaListId(subChoiceArr);
          if (errSubChoice) {
            this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
            this.error.errorType = Constants.ERROR_TYPE.API;
            this.error.errorKey = data.result.toString();
            this.error.message = data.message || '';
            throw this.error;
          }

          const sub_choices = data.result as ChoiceDocument[];
          for (let s = 0; s < (sub_choices || []).length; s++) {
            const sub_choice = sub_choices[s];
            const returnedSubChoice: ChoiceResponseOutput = {
              choice_id: sub_choice._id,
              option_ar: sub_choice.option_ar,
              option_en: sub_choice.option_en,
              position_en: sub_choice?.position_en,
              position_ar: sub_choice?.position_ar,
              icon: sub_choice.icon,
              score: sub_choice.score,
            };
            foundAnswerArr.answers[a].sub_choices = foundAnswerArr.answers[
              a
            ].sub_choices.concat([returnedSubChoice]) as any;
          }
        }
        continue;
      }

      return foundAnswerArr;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
          'mappingMultipleChoiceInSameAnswer ' + exception.message
        );
      }
    }
  }

  async getFilterResponse(productId: string): Promise<[boolean, any]> {
    try {
      if (!productId) {
        this.error.errorCode = Constants.ERROR_CODE.NOT_FOUND;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        throw this.error;
      }
      const product = await this.productRepository.findProductById(productId);
      if (!product) {
        this.error.errorCode = Constants.ERROR_CODE.NOT_FOUND;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        throw this.error;
      }
      const [errFilter, filterRes] =
        await this.responseRepository.getFilterResponse(productId);
      if (errFilter) {
        if (filterRes.result === Constants.ERROR_MAP.RESPONSE_NOT_FOUND) {
          return [false, []];
        }
        this.error.errorCode = filterRes.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = filterRes.result.toString();
        this.error.message = filterRes.message || '';
        throw this.error;
      }

      const returnedResponseArr: ResponseOutput[] = [];
      let Body_defect_content = null;
      const data = (filterRes.result as any) || [];

      for (let r = 0; r < data.length; r++) {
        let returnedResponse: ResponseOutput = {};
        const itemResponse = data[r];
        const [errQues, reQuestion] =
          await this.questionRepository.getQuestionById(
            itemResponse.question_id
          );

        if (errQues) {
          continue;
        }
        const question = reQuestion.result as QuestionDocument;

        if (returnedResponseArr.length > 0) {
          const foundIndex = returnedResponseArr.findIndex(
            item =>
              (item.question_id || '').toString() ===
              (question._id || '').toString()
          );
          if (foundIndex !== -1) {
            let foundAnswerArr = returnedResponseArr[foundIndex];
            foundAnswerArr = await this.mappingMultipleChoiceInSameAnswer(
              foundAnswerArr,
              itemResponse
            );
            returnedResponseArr[foundIndex] = foundAnswerArr;
            continue;
          }
        }

        returnedResponse.response_id = product.response;
        returnedResponse.question_id = question._id;
        returnedResponse.question_type = question.type;
        returnedResponse.order = question.order;
        returnedResponse.question_en = question.question_en;
        returnedResponse.question_ar = question.question_ar;
        returnedResponse.question_key = question.question_key;
        returnedResponse.text_answer = itemResponse.text_answer;
        returnedResponse.text_placeholder_ar = question.text_placeholder_ar;
        returnedResponse.text_placeholder_en = question.text_placeholder_en;
        returnedResponse.subtext_ar = question.subtext_ar;
        returnedResponse.subtext_en = question.subtext_en;

        // temp solution from PO Team
        returnedResponse.bug_free_answer = true;
        returnedResponse.question_summary_content =
          question.summary_content?.valid_content;
        const responseAns = itemResponse.answer_ids || [];
        returnedResponse = await this.retrieveMappingAnswer(
          responseAns,
          returnedResponse
        );

        const responseChoice = itemResponse.choices || [];
        returnedResponse = await this.retrieveMappingChoice(
          responseChoice,
          returnedResponse
        );

        if (question.question_key == QuestionKey.SCREEN_BODY)
          Body_defect_content = question.summary_content?.defect_content;
        returnedResponseArr.push(returnedResponse);
      }

      // this is temp solution from PO only on like new
      if (product.grade == Constants.product.GRADE.LIKE_NEW.EN) {
        // not eq 0 score means less than 90% in battery
        const batteryIndex = returnedResponseArr.findIndex(
          elem => elem.question_key == QuestionKey.BATTERY
        );
        const bodyIndex = returnedResponseArr.findIndex(
          elem => elem.question_key == QuestionKey.SCREEN_BODY
        );
        if (
          product.score >= 98 &&
          product.score <= 99 &&
          returnedResponseArr[batteryIndex]?.choices[0]?.score == 0
        ) {
          returnedResponseArr[bodyIndex].bug_free_answer = false;
          returnedResponseArr[bodyIndex].question_summary_content =
            Body_defect_content;
        }
      }
      return [false, returnedResponseArr];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
          exception.message
        );
      }
    }
  }

  async getResponse(responseId: string) {
    try {
      const [errRes, response] = await this.responseRepository.getResponse(
        responseId
      );
      if (errRes) {
        this.error.errorCode = response.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = response.result.toString();
        throw this.error;
      }
      return [errRes, response.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE
      );
    }
  }

  async getFullResponse(
    responseId: string,
    userId: string
  ): Promise<
    [
      boolean,
      {
        code?: number;
        returnedResponseArr?: ResponseOutput[];
        isKeySeller?: boolean;
        message?: string;
      }
    ]
  > {
    try {
      const [errFilter, filterRes] = await this.responseRepository.getResponse(
        responseId
      );
      if (errFilter) {
        if (filterRes.result === Constants.ERROR_MAP.RESPONSE_NOT_FOUND) {
          return [false, {}];
        }
        this.error.errorCode = filterRes.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = filterRes.result.toString();
        this.error.message = filterRes.message || '';
        throw this.error;
      }
      const userData: UserLegacyDocument =
        await this.userRepository.getUserById(userId);
      const returnedResponseArr: ResponseOutput[] = [];
      const data = (filterRes.result as any) || [];
      const questionsId: mongoose.Types.ObjectId[] = [];
      const duplicatedId: boolean[] = [false];
      data.responses.map((response: any, index: number) => {
        questionsId.push(new mongoose.Types.ObjectId(response.question_id));
        if (index > 0) {
          response.question_id === questionsId[index - 1]?.toString()
            ? duplicatedId.push(true)
            : duplicatedId.push(false);
        }
      });
      const [errQues, reQuestion] =
        await this.questionRepository.getQuestionsByIdArray(questionsId);
      const finalQuestion: QuestionDocument[] = [];
      let reQuestionIndex = 0;
      duplicatedId.map((isDuplicated: boolean, index: number) => {
        if (!isDuplicated) {
          finalQuestion.push(
            reQuestion.result[reQuestionIndex] as QuestionDocument
          );
          reQuestionIndex++;
        } else {
          finalQuestion.push(finalQuestion[index - 1] as QuestionDocument);
        }
      });
      if (errQues) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = reQuestion.result.toString();
        this.error.message = reQuestion.message || '';
        throw this.error;
      }

      for (let r = 0; r < data.responses.length; r++) {
        let returnedResponse: ResponseOutput = {};
        const itemResponse = data.responses[r];

        const question = finalQuestion.find(
          question => question.id === itemResponse?.question_id
        );

        if (returnedResponseArr.length > 0) {
          const foundIndex = returnedResponseArr.findIndex(
            item =>
              (item.question_id || '').toString() ===
              (question._id || '').toString()
          );
          if (foundIndex !== -1) {
            let foundAnswerArr = returnedResponseArr[foundIndex];
            foundAnswerArr = await this.mappingMultipleChoiceInSameAnswer(
              foundAnswerArr,
              itemResponse
            );
            returnedResponseArr[foundIndex] = foundAnswerArr;
            continue;
          }
        }
        returnedResponse.question_id = question._id;
        returnedResponse.question_type = question.type;
        returnedResponse.order = question.order;
        returnedResponse.question_en = question.question_en;
        returnedResponse.question_ar = question.question_ar;
        returnedResponse.text_answer = itemResponse.text_answer;
        returnedResponse.text_placeholder_ar = question.text_placeholder_ar;
        returnedResponse.text_placeholder_en = question.text_placeholder_en;
        returnedResponse.subtext_ar = question.subtext_ar;
        returnedResponse.subtext_en = question.subtext_en;
        const responseAns = itemResponse.answer_ids || [];
        returnedResponse = await this.retrieveMappingAnswer(
          responseAns,
          returnedResponse
        );

        const responseChoice = itemResponse.choices || [];
        returnedResponse = await this.retrieveMappingChoice(
          responseChoice,
          returnedResponse
        );
        returnedResponseArr.push(returnedResponse);
      }

      return [
        false,
        { returnedResponseArr, isKeySeller: userData.isKeySeller },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE
      );
    }
  }

  async calculateScoreChoice(
    subChoiceIds: string[] | [],
    initialScore: number
  ): Promise<number> {
    const [errSubChoice, data] = await this.choiceRepository.getChoiceViaListId(
      subChoiceIds
    );
    if (errSubChoice) {
      this.error.errorCode = data.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = data.result.toString();
      this.error.message = data.message || '';
      throw this.error;
    }
    const subChoices = data.result as ChoiceDocument[];
    for (let s = 0; s < (subChoices || []).length; s++) {
      const subChoiceScore = subChoices[s].score;
      initialScore += subChoiceScore;
    }
    return initialScore;
  }

  async mapToGetChoice(
    subChoiceIds: string[] | [],
    answer_to_question_en: AnswerToQuestion,
    answer_to_question_ar: AnswerToQuestion
  ): Promise<{
    answer_to_question_en: AnswerToQuestion;
    answer_to_question_ar: AnswerToQuestion;
  }> {
    if (subChoiceIds.length === 0) {
      return { answer_to_question_en, answer_to_question_ar };
    }
    const [errSubChoice, data] = await this.choiceRepository.getChoiceViaListId(
      subChoiceIds
    );
    if (errSubChoice) {
      this.error.errorCode = data.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = data.result.toString();
      this.error.message = data.message || '';
      throw this.error;
    }
    const subChoices = data.result as ChoiceDocument[];
    for (let s = 0; s < (subChoices || []).length; s++) {
      answer_to_question_en.answer =
        answer_to_question_en.answer.length > 0
          ? answer_to_question_en.answer.concat(
              ', ',
              (subChoices[s].option_en || '').toLowerCase()
            )
          : subChoices[s].option_en;
      answer_to_question_ar.answer =
        answer_to_question_ar.answer.length > 0
          ? answer_to_question_ar.answer.concat(
              ', ',
              (subChoices[s].option_ar || '').toLowerCase()
            )
          : subChoices[s].option_ar;
    }
    return { answer_to_question_en, answer_to_question_ar };
  }

  async mapToGetAnswer(
    answerIds: ItemAnswerInput[] | [],
    answer_to_question_en: AnswerToQuestion,
    answer_to_question_ar: AnswerToQuestion
  ): Promise<{
    answer_to_question_en: AnswerToQuestion;
    answer_to_question_ar: AnswerToQuestion;
  }> {
    for (let a = 0; a < answerIds.length; a++) {
      const answerId = answerIds[a].answer_id || null;
      if (answerId) {
        const [errAnswer, data] = await this.answerRepository.getAnswerViaId(
          answerId
        );
        if (errAnswer) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.result.toString();
          throw this.error;
        }
        answer_to_question_en.answer = (
          data.result as AnswerDocument
        ).answer_en;
        answer_to_question_ar.answer = (
          data.result as AnswerDocument
        ).answer_ar;
      }
      if (!answerIds[a].sub_choices) {
        continue;
      }
      const subChoiceIds = answerIds[a].sub_choices || [];
      const result = await this.mapToGetChoice(
        subChoiceIds,
        answer_to_question_en,
        answer_to_question_ar
      );
      answer_to_question_en = result.answer_to_question_en;
      answer_to_question_ar = result.answer_to_question_ar;
    }
    return { answer_to_question_en, answer_to_question_ar };
  }

  async calculateScoreAnswer(
    answerIds: ItemAnswerInput[] | [],
    initialScore: number
  ): Promise<number> {
    for (let a = 0; a < answerIds.length; a++) {
      const answerId = answerIds[a].answer_id || null;
      if (answerId) {
        const [errAnswer, data] = await this.answerRepository.getAnswerViaId(
          answerId
        );
        if (errAnswer) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.result.toString();
          this.error.message = data.message || '';
          throw this.error;
        }
        const answerScore = (data.result as AnswerDocument).score;
        initialScore += answerScore;
      }
      if (!answerIds[a].sub_choices) {
        continue;
      }
      const subChoiceIds = answerIds[a].sub_choices || [];
      initialScore = await this.calculateScoreChoice(
        subChoiceIds,
        initialScore
      );
    }
    return initialScore;
  }

  async addResponse(
    request: ResponseInput
  ): Promise<[boolean, string | ResponseType, number]> {
    try {
      if (request.product_id) {
        const product = await this.productRepository.findProductById(
          request.product_id
        );
        if (!product) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
          throw this.error;
        }
      }

      const answer_to_questions_en: AnswerToQuestion[] = [];
      const answer_to_questions_ar: AnswerToQuestion[] = [];

      let initialScore = 100;
      for (let q = 0; q < request.responses.length; q++) {
        const question_id = request.responses[q].question_id;
        const [err, resQuestion] =
          await this.questionRepository.getQuestionById(question_id);
        if (err) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = resQuestion.result.toString();
          this.error.message = resQuestion.message || '';
          throw this.error;
        }
        const answerIds = request.responses[q].answer_ids || [];
        initialScore = answerIds.length
          ? await this.calculateScoreAnswer(answerIds, initialScore)
          : initialScore;
        const choicesArray = request.responses[q].choices || [];
        const choiceIds = choicesArray.map((choice: any) =>
          choice.choiceId ? choice.choiceId : choice.id
        );
        initialScore = choiceIds.length
          ? await this.calculateScoreChoice(choiceIds, initialScore)
          : initialScore;

        // Add backward compatibility for answer to question of legacy product
        const answer_to_question_en: AnswerToQuestion = {
          question: (resQuestion.result as QuestionDocument).question_en || '',
          answer: '',
        };
        const answer_to_question_ar: AnswerToQuestion = {
          question: (resQuestion.result as QuestionDocument).question_ar || '',
          answer: '',
        };
        const mapToGetAnswer = await this.mapToGetAnswer(
          answerIds,
          answer_to_question_en,
          answer_to_question_ar
        );
        const result = await this.mapToGetChoice(
          choiceIds,
          mapToGetAnswer.answer_to_question_en,
          mapToGetAnswer.answer_to_question_ar
        );
        answer_to_questions_en.push(result.answer_to_question_en);
        answer_to_questions_ar.push(result.answer_to_question_ar);
      }

      // update score product if sending productId
      if (request.product_id) {
        const [errProduct, product] =
          await this.productRepository.findAndUpdateScoreProduct(
            request.product_id,
            initialScore
          );
        if (errProduct) {
          this.error.errorCode = product.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = product.result.toString();
          throw this.error;
        }
        // update answer to question of legacy product
        const [errAnswerQues, answerQues] =
          await this.productRepository.findAndUpdateAnswerToQuestionProduct(
            request.product_id,
            answer_to_questions_en,
            answer_to_questions_ar
          );
        if (errAnswerQues) {
          this.error.errorCode = answerQues.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = answerQues.result.toString();
          throw this.error;
        }
      }

      const [errAddRes, newResponse] =
        await this.responseRepository.addResponse(request);
      if (errAddRes) {
        this.error.errorCode = newResponse.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = newResponse.result.toString();
        throw this.error;
      }

      if (request.product_id) {
        const responseId = (newResponse.result as ResponseType)._id;
        const [errResPro, resProd] =
          await this.productRepository.findAndLinkResponseToProduct(
            request.product_id,
            responseId
          );
        if (errResPro) {
          this.error.errorCode = resProd.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = resProd.result.toString();
          throw this.error;
        }
      }
      return [errAddRes, newResponse.result, initialScore];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_RESPONSE,
          exception.message
        );
      }
    }
  }

  async updateResponse(responseId: string, request: ResponseInput) {
    try {
      if (!responseId) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.RESPONSE_NOT_FOUND;
        throw this.error;
      }

      const [errRes, response] = await this.responseRepository.getResponse(
        responseId
      );
      if (errRes) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = response.result.toString();
        this.error.message = response.message || '';
        throw this.error;
      }

      if (request.product_id) {
        const product =
          (response.result as ResponseType).product.toString() ===
          request.product_id;
        if (!product) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
          this.error.message =
            'None of response found with product id ' + request.product_id;
          throw this.error;
        }
      }

      const answer_to_questions_en: AnswerToQuestion[] = [];
      const answer_to_questions_ar: AnswerToQuestion[] = [];

      let initialScore = 100;
      for (let q = 0; q < request.responses.length; q++) {
        const question_id = request.responses[q].question_id;
        const [err, resQuestion] =
          await this.questionRepository.getQuestionById(question_id);
        if (err) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = resQuestion.result.toString();
          this.error.message = resQuestion.message || '';
          throw this.error;
        }
        const answerIds = request.responses[q].answer_ids || [];
        initialScore = await this.calculateScoreAnswer(answerIds, initialScore);
        const choicesArray = request.responses[q].choices || [];
        const choiceIds = choicesArray.map(choice => choice.choiceId);
        initialScore = await this.calculateScoreChoice(choiceIds, initialScore);

        // Add backward compatibility for answer to question of legacy product
        const answer_to_question_en: AnswerToQuestion = {
          question: (resQuestion.result as QuestionDocument).question_en || '',
          answer: '',
        };
        const answer_to_question_ar: AnswerToQuestion = {
          question: (resQuestion.result as QuestionDocument).question_ar || '',
          answer: '',
        };
        const mapToGetAnswer = await this.mapToGetAnswer(
          answerIds,
          answer_to_question_en,
          answer_to_question_ar
        );
        const result = await this.mapToGetChoice(
          choiceIds,
          mapToGetAnswer.answer_to_question_en,
          mapToGetAnswer.answer_to_question_ar
        );
        answer_to_questions_en.push(result.answer_to_question_en);
        answer_to_questions_ar.push(result.answer_to_question_ar);
      }

      // update score product if sending productId
      if (request.product_id) {
        const [errProduct, product] =
          await this.productRepository.findAndUpdateScoreProduct(
            request.product_id,
            initialScore
          );
        if (errProduct) {
          this.error.errorCode = product.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = product.result.toString();
          throw this.error;
        }
        // update answer to question of legacy product
        const [errAnswerQues, answerQues] =
          await this.productRepository.findAndUpdateAnswerToQuestionProduct(
            request.product_id,
            answer_to_questions_en,
            answer_to_questions_ar
          );
        if (errAnswerQues) {
          this.error.errorCode = answerQues.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = answerQues.result.toString();
          throw this.error;
        }
      }

      const [errUpdateRes, updateRes] =
        await this.responseRepository.updateResponse(responseId, request);
      if (errUpdateRes) {
        this.error.errorCode = updateRes.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = updateRes.result.toString();
        this.error.message = updateRes.message || '';
        throw this.error;
      }

      return [errUpdateRes, updateRes.result, initialScore];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_RESPONSE,
          exception.message
        );
      }
    }
  }

  async removeResponse(responseId: string) {
    try {
      if (!responseId) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.RESPONSE_NOT_FOUND;
        this.error.message = 'Undefined response id';
        throw this.error;
      }
      const [err, data] = await this.responseRepository.removeResponse(
        responseId
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message || '';
        throw this.error;
      }

      return [err, data.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_RESPONSE,
          exception.message
        );
      }
    }
  }
}
