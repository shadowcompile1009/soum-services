import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _remove from 'lodash/remove';
import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { AnswerDocument } from '../models/Answer';
import { ChoiceDocument } from '../models/Choice';
import { ResponseInput, ResponseType } from '../models/Response';
import { AddressRepository } from '../repositories/addressRepository';
import { AnswerRepository } from '../repositories/answerRepository';
import { BrandRepository } from '../repositories/brandRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { ModelRepository } from '../repositories/modelRepository';
import { ProductRepository } from '../repositories/productRepository';
import { QuestionnaireRepository } from '../repositories/questionnaireRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ResponseRepository } from '../repositories/responseRepository';
import { UserRepository } from '../repositories/userRepository';
import { VariantRepository } from '../repositories/variantRepository';

@Service()
export class MigrationService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  responseRepository: ResponseRepository;
  @Inject()
  choiceRepository: ChoiceRepository;
  @Inject()
  questionnaireRepository: QuestionnaireRepository;
  @Inject()
  productRepository: ProductRepository;
  @Inject()
  questionRepository: QuestionRepository;
  @Inject()
  answerRepository: AnswerRepository;
  @Inject()
  userRepository: UserRepository;
  @Inject()
  addressRepository: AddressRepository;

  @Inject()
  variantRepository: VariantRepository;

  @Inject()
  categoryRepository: CategoryRepository;

  @Inject()
  brandRepository: BrandRepository;
  @Inject()
  modelRepository: ModelRepository;

  async mapNoQuestionsOfYesNoWithoutOptionsType(
    answer: any,
    oldQuestionsArray: any,
    product: any
  ) {
    try {
      let canBeaNo: any;
      let foundMapping: boolean;
      for (let q = 0; q < (answer.no_questions || []).length; q++) {
        const noQuestion = (answer.no_questions[q] || {}).question || '';
        const noAnswerArr = (answer.no_questions[q] || {}).answers || [];
        for (let a = 0; a < (noAnswerArr || []).length; a++) {
          const noAnswer = noAnswerArr[a];
          canBeaNo = _find(oldQuestionsArray, {
            question: noQuestion,
            answer: noAnswer,
          });
          if (canBeaNo) {
            foundMapping = true;
            break;
          }
        }

        if (foundMapping) {
          break;
        } else {
          const unmatchedQuestion = _find(oldQuestionsArray, {
            question: noQuestion,
          });
          if (unmatchedQuestion) {
            await this.updateUnmatchedQuestionAnswerInProductModel(product, [
              unmatchedQuestion,
            ]);
          }
        }
        continue;
      }
      return { mapping: foundMapping, canBeaNo };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
          'Fail to mapNoQuestionsOfYesNoWithoutOptionsType with product ' +
            product._id
        );
      }
    }
  }

  async mappingYesNoWithoutOptionsType(
    newQuestion: any,
    oldQuestionsArray: any,
    product: any,
    initialScore: number
  ) {
    try {
      const unansweredquestions = [];
      for (let a = 0; a < (newQuestion.answers || []).length; a++) {
        const answer = newQuestion.answers[a];
        if (answer.answer_en === 'Yes') {
          const foundYesQuestion = _find(
            oldQuestionsArray,
            oldQ =>
              oldQ.question.trim().toLowerCase() ===
              (answer.yes_question || '').trim().toLowerCase()
          );
          let foundAnswerFromYesQuestion = false;
          if (foundYesQuestion) {
            foundAnswerFromYesQuestion = _find(
              answer.yes_answers,
              answer => answer === foundYesQuestion.answer.trim()
            );
          }
          const isItaYes = foundYesQuestion && foundAnswerFromYesQuestion;
          if (isItaYes) {
            // createNewResponse(productId, $newQuestion.id, $Answer.id);
            const newResponse: ResponseInput = {
              product_id: (product as any)._id.toString(),
              responses: [
                {
                  question_id: newQuestion._id,
                  answer_ids: [
                    {
                      answer_id: answer._id,
                    },
                  ],
                },
              ],
            };
            const [errRes, response] =
              await this.responseRepository.addResponse(newResponse);
            if (errRes) {
              this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
              this.error.errorType = Constants.ERROR_TYPE.API;
              this.error.errorKey = response.result.toString();
              throw this.error;
            }
            // update score, grade of product
            initialScore =
              await this.recalculateScoreYesNoWithOrWithoutOptionsType(
                answer._id,
                null,
                newResponse.product_id,
                initialScore
              );

            oldQuestionsArray = _filter(
              oldQuestionsArray,
              oldQuestion => oldQuestion != foundYesQuestion
            );
            const responseId = (response.result as ResponseType)._id.toString();
            // save oldQuestionArray
            const [errProduct, msg] =
              await this.productRepository.updateAnswerQuestionInProductModel(
                (product as any)._id,
                oldQuestionsArray,
                responseId
              );
            if (errProduct) {
              this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
              this.error.errorType = Constants.ERROR_TYPE.API;
              this.error.errorKey = msg.toString();
              throw this.error;
            }
            break;
          }
          if (foundYesQuestion && !foundAnswerFromYesQuestion) {
            // unmatched question answer between current QA and question/answer from questionnaire
            await this.updateUnmatchedQuestionAnswerInProductModel(product, [
              foundYesQuestion,
            ]);
          }
          continue;
        }
        if (answer.answer_en === 'No') {
          const { mapping, canBeaNo } =
            await this.mapNoQuestionsOfYesNoWithoutOptionsType(
              answer,
              oldQuestionsArray,
              product
            );
          if (mapping && canBeaNo) {
            // createNewResponse(productId, $newQuestion.id, $Answer.id);
            const newResponse: ResponseInput = {
              product_id: (product as any)._id.toString(),
              responses: [
                {
                  question_id: newQuestion._id,
                  answer_ids: [
                    {
                      answer_id: answer._id,
                    },
                  ],
                },
              ],
            };
            const [errRes, response] =
              await this.responseRepository.addResponse(newResponse);
            if (errRes) {
              this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
              this.error.errorType = Constants.ERROR_TYPE.API;
              this.error.errorKey = response.result.toString();
              throw this.error;
            }

            // update score, grade of product
            initialScore =
              await this.recalculateScoreYesNoWithOrWithoutOptionsType(
                answer._id,
                null,
                newResponse.product_id,
                initialScore
              );

            // oldQuestionsArray.removeAll($newQuestion.no_questions);
            oldQuestionsArray = _filter(
              oldQuestionsArray,
              oldQuestion => oldQuestion != canBeaNo
            );
            const responseId = (response.result as ResponseType)._id.toString();
            // save oldQuestionArray
            const [errProduct, msg] =
              await this.productRepository.updateAnswerQuestionInProductModel(
                (product as any)._id,
                oldQuestionsArray,
                responseId
              );
            if (errProduct) {
              this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
              this.error.errorType = Constants.ERROR_TYPE.API;
              this.error.errorKey = msg.toString();
              throw this.error;
            }
            break;
          }
        }
        // unmatched question/answer of no
        unansweredquestions.push(newQuestion);
        break;
      }
      if (unansweredquestions.length > 0) {
        // save unAnswerQuestionArray
        const [errUnanswerQues, unAnswerQuestion] =
          await this.productRepository.updateUnAnswerQuestionInProductModel(
            (product as any)._id,
            unansweredquestions
          );
        if (errUnanswerQues) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = unAnswerQuestion.toString();
          throw this.error;
        }
      }
      return initialScore;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
          'Fail to mappingYesNoWithoutOptionsType'
        );
      }
    }
  }

  async updateUnmatchedQuestionAnswerInProductModel(
    product: any,
    foundUnmatchedYesQuestions: any
  ) {
    try {
      // unmatched question answer between current QA and question/answer from questionnaire
      const [errUnmatchedanswerQues, unmatchedAnswerQuestion] =
        await this.productRepository.updateUnMatchingAnswerQuestionInProductModel(
          (product as any)._id,
          foundUnmatchedYesQuestions
        );
      if (errUnmatchedanswerQues) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = unmatchedAnswerQuestion.toString();
        throw this.error;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
          'Fail to updateUnmatchedQuestionAnswerInProductModel'
        );
      }
    }
  }

  async recalculateScoreYesNoWithOrWithoutOptionsType(
    answerId: string,
    subChoice: string,
    productId: string,
    initialScore: number
  ) {
    try {
      // recalculate score and set grade of product
      initialScore = await this.calculateScoreAnswer(
        answerId,
        subChoice,
        initialScore
      );
      const [errUpdatedProduct, updatedProduct] =
        await this.productRepository.findAndUpdateScoreProduct(
          productId,
          initialScore
        );
      if (errUpdatedProduct) {
        this.error.errorCode = updatedProduct.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = updatedProduct.result.toString();
        this.error.message = updatedProduct.message || '';
        throw this.error;
      }
      return initialScore;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
          'Fail to recalculateScoreYesNoWithOptionsType'
        );
      }
    }
  }

  async recalculateScoreWithDropdownType(
    answerId: string,
    choice: string,
    productId: string,
    initialScore: number
  ) {
    try {
      // recalculate score and set grade of product
      initialScore = await this.calculateScoreAnswer(
        answerId,
        null,
        initialScore
      );
      initialScore = await this.calculateScoreChoice(choice, initialScore);
      const [errUpdatedProduct, updatedProduct] =
        await this.productRepository.findAndUpdateScoreProduct(
          productId,
          initialScore
        );
      if (errUpdatedProduct) {
        this.error.errorCode = updatedProduct.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = updatedProduct.result.toString();
        this.error.message = updatedProduct.message || '';
        throw this.error;
      }
      return initialScore;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
          'Fail to recalculateScoreWithDropdownType'
        );
      }
    }
  }

  async mappingYesNoWithOptionsType(
    newQuestion: any,
    oldQuestionsArray: any,
    product: any,
    initialScore: number
  ) {
    try {
      const unansweredquestions = [];
      const unmatchedquestions = [];
      for (let a = 0; a < (newQuestion.answers || []).length; a++) {
        const answer = newQuestion.answers[a];
        if (answer.answer_en === 'Yes') {
          const subChoiceArr = answer.sub_choices || [];
          for (let s = 0; s < subChoiceArr.length; s++) {
            const subChoice = subChoiceArr[s];
            const foundYesQuestion = _find(
              oldQuestionsArray,
              oldQ =>
                oldQ.question.trim().toLowerCase() ===
                (subChoice.yes_question || '').trim().toLowerCase()
            );
            let foundAnswerFromYesQuestion = false;
            if (foundYesQuestion) {
              foundAnswerFromYesQuestion = _find(
                subChoice.yes_answers,
                answer => answer === foundYesQuestion.answer.trim()
              );
            }
            const isItaYes = foundYesQuestion && foundAnswerFromYesQuestion;
            if (isItaYes) {
              if (unmatchedquestions.length > 0) {
                _remove(
                  unmatchedquestions,
                  unmatchedQ =>
                    unmatchedQ.question === foundYesQuestion.question
                );
              }
              // createNewResponse(productId, $newQuestion.id, $Answer.id);
              const newResponse: ResponseInput = {
                product_id: (product as any)._id.toString(),
                responses: [
                  {
                    question_id: newQuestion._id,
                    answer_ids: [
                      {
                        answer_id: answer._id,
                        sub_choices: [subChoice._id],
                      },
                    ],
                  },
                ],
              };
              const [errRes, response] =
                await this.responseRepository.addResponse(newResponse);
              if (errRes) {
                this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
                this.error.errorType = Constants.ERROR_TYPE.API;
                this.error.errorKey = response.result.toString();
                throw this.error;
              }

              // update score, grade of product
              initialScore =
                await this.recalculateScoreYesNoWithOrWithoutOptionsType(
                  answer._id,
                  subChoice._id,
                  newResponse.product_id,
                  initialScore
                );

              oldQuestionsArray = _filter(
                oldQuestionsArray,
                oldQuestion => oldQuestion != foundYesQuestion
              );
              const responseId = (
                response.result as ResponseType
              )._id.toString();
              // save oldQuestionArray
              const [errProduct, msg] =
                await this.productRepository.updateAnswerQuestionInProductModel(
                  (product as any)._id,
                  oldQuestionsArray,
                  responseId
                );
              if (errProduct) {
                this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
                this.error.errorType = Constants.ERROR_TYPE.API;
                this.error.errorKey = msg.toString();
                throw this.error;
              }
            }
            if (foundYesQuestion && !foundAnswerFromYesQuestion) {
              // unmatched question answer between current QA and question/answer from questionnaire
              // await this.updateUnmatchedQuestionAnswerInProductModel(product, foundYesQuestion);
              unmatchedquestions.push(foundYesQuestion);
            }
            if (newQuestion.answers.length === 1) {
              break;
            }
            continue;
          }
          continue;
        }

        if (answer.answer_en === 'No') {
          const { mapping, canBeaNo } =
            await this.mapNoQuestionsOfYesNoWithoutOptionsType(
              answer,
              oldQuestionsArray,
              product
            );
          if (mapping && canBeaNo) {
            // createNewResponse(productId, $newQuestion.id, $Answer.id);
            const newResponse: ResponseInput = {
              product_id: (product as any)._id,
              responses: [
                {
                  question_id: newQuestion._id,
                  answer_ids: [
                    {
                      answer_id: answer._id,
                    },
                  ],
                },
              ],
            };
            const [errRes, response] =
              await this.responseRepository.addResponse(newResponse);
            if (errRes) {
              this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
              this.error.errorType = Constants.ERROR_TYPE.API;
              this.error.errorKey = response.result.toString();
              throw this.error;
            }
            // update score, grade of product
            initialScore =
              await this.recalculateScoreYesNoWithOrWithoutOptionsType(
                answer._id,
                null,
                newResponse.product_id,
                initialScore
              );
            // oldQuestionsArray.removeAll($newQuestion.no_questions);
            oldQuestionsArray = _filter(
              oldQuestionsArray,
              oldQuestion => oldQuestion != canBeaNo
            );
            const responseId = (response.result as ResponseType)._id.toString();
            // save oldQuestionArray
            const [errProduct, msg] =
              await this.productRepository.updateAnswerQuestionInProductModel(
                (product as any)._id,
                oldQuestionsArray,
                responseId
              );
            if (errProduct) {
              this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
              this.error.errorType = Constants.ERROR_TYPE.API;
              this.error.errorKey = msg.toString();
              throw this.error;
            }
            break;
          }
        }
        // unmatched question/answer of no
        unansweredquestions.push(newQuestion);
        break;
      }
      if (unmatchedquestions.length > 0) {
        await this.updateUnmatchedQuestionAnswerInProductModel(
          product,
          unmatchedquestions
        );
      }
      if (unansweredquestions.length > 0) {
        // save unAnswerQuestionArray
        const [errUnanswerQues, unAnswerQuestion] =
          await this.productRepository.updateUnAnswerQuestionInProductModel(
            (product as any)._id,
            unansweredquestions
          );
        if (errUnanswerQues) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = unAnswerQuestion.toString();
          throw this.error;
        }
      }
      return initialScore;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
          'Fail to mappingYesNoWithoutOptionsType'
        );
      }
    }
  }

  async mappingDropdownType(
    newQuestion: any,
    oldQuestionsArray: any,
    product: any,
    initialScore: number
  ) {
    try {
      const unansweredquestions = [];
      for (let c = 0; c < (newQuestion.choices || []).length; c++) {
        const choice = newQuestion.choices[c];
        const foundYesQuestion = _find(
          oldQuestionsArray,
          oldQ =>
            oldQ.question.toLowerCase() ===
            (choice.yes_question || '').toLowerCase()
        );
        let foundAnswerFromYesQuestion = false;
        if (foundYesQuestion) {
          foundAnswerFromYesQuestion = _find(
            choice.yes_answers,
            answer => answer === foundYesQuestion.answer
          );
        }
        const isItaYes = foundYesQuestion && foundAnswerFromYesQuestion;
        if (isItaYes) {
          // createNewResponse(productId, $newQuestion.id, $Answer.id);
          const newResponse: ResponseInput = {
            product_id: (product as any)._id.toString(),
            responses: [
              {
                question_id: newQuestion._id,
                answer_ids: [
                  {
                    answer_id: null,
                  },
                ],
                choices: [choice._id.toString()],
              },
            ],
          };
          const [errRes, response] = await this.responseRepository.addResponse(
            newResponse
          );
          if (errRes) {
            this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
            this.error.errorType = Constants.ERROR_TYPE.API;
            this.error.errorKey = response.result.toString();
            throw this.error;
          }

          // update score. grade of product
          const choiceId = choice._id.toString() || null;
          initialScore = await this.recalculateScoreWithDropdownType(
            null,
            choiceId,
            newResponse.product_id,
            initialScore
          );

          oldQuestionsArray = _filter(
            oldQuestionsArray,
            oldQuestion => oldQuestion != foundYesQuestion
          );
          const responseId = (response.result as ResponseType)._id.toString();
          // save oldQuestionArray
          const [errProduct, msg] =
            await this.productRepository.updateAnswerQuestionInProductModel(
              (product as any)._id,
              oldQuestionsArray,
              responseId
            );
          if (errProduct) {
            this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
            this.error.errorType = Constants.ERROR_TYPE.API;
            this.error.errorKey = msg.toString();
            throw this.error;
          }
          break;
        }
        if (foundYesQuestion && !foundAnswerFromYesQuestion) {
          if (c === newQuestion.choices.length - 1) {
            // unmatched question answer between current QA and question/answer from questionnaire
            await this.updateUnmatchedQuestionAnswerInProductModel(product, [
              foundYesQuestion,
            ]);
            // unmatched question/answer of yes
            unansweredquestions.push(newQuestion);
            break;
          }
        }
        continue;
      }
      if (unansweredquestions.length > 0) {
        // save unAnswerQuestionArray
        const [errUnanswerQues, unAnswerQuestion] =
          await this.productRepository.updateUnAnswerQuestionInProductModel(
            (product as any)._id,
            unansweredquestions
          );
        if (errUnanswerQues) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = unAnswerQuestion.toString();
          throw this.error;
        }
      }
      return initialScore;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
          'Fail to mappingYesNoWithoutOptionsType'
        );
      }
    }
  }

  async calculateScoreChoice(
    subChoiceId: string,
    initialScore: number
  ): Promise<number> {
    if (subChoiceId) {
      const [errSubChoice, subChoice] =
        await this.choiceRepository.getChoiceViaId(subChoiceId);
      if (errSubChoice) {
        this.error.errorCode = subChoice.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = subChoice.result.toString();
        this.error.message = subChoice.message || '';
        throw this.error;
      }
      const subChoiceScore = (subChoice.result as ChoiceDocument).score;
      initialScore += subChoiceScore;
      return initialScore;
    } else {
      return initialScore;
    }
  }

  async calculateScoreAnswer(
    answerId: string,
    sub_choice: string,
    initialScore: number
  ): Promise<number> {
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
      const answerScore = (data.result as AnswerDocument).score;
      initialScore += answerScore;
    }
    if (sub_choice) {
      initialScore = await this.calculateScoreChoice(sub_choice, initialScore);
    }
    return initialScore;
  }

  async generateResponse() {
    let categoryId: string;
    let questionnaireId: string;
    let productId;
    try {
      const [errProduct, product] =
        await this.productRepository.getFirstProductNotMigrated();
      if (errProduct) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = product.toString();
        throw this.error;
      }
      if (!product) {
        return 'No more products';
      }
      // validate invalid status product
      if ((product as any).status === 'Deleted') {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.INVALID_DELETED_STATUS;
        this.error.message =
          'Deleted status with productId ' + (product as any)._id;
        throw this.error;
      }
      categoryId = ((product as any).category_id || '').toString();
      const [errQuesViaCat, resQuesViaCat] =
        await this.questionnaireRepository.getQuestionnaireViaCategoryId(
          categoryId
        );
      if (errQuesViaCat) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = resQuesViaCat.toString();
        throw this.error;
      }
      questionnaireId = ((resQuesViaCat as any)._id || '').toString();

      const answer_to_questions = (product as any).answer_to_questions || '';
      if (answer_to_questions.length === 0) {
        await this.productRepository.updateMigrationFlagInProductModel(
          (product as any)._id,
          'COMPLETED'
        );
        return (
          'No answer to questions to migrate on productId ' +
          (product as any)._id
        );
      }
      const oldQuestionsArray = JSON.parse(
        (product as any).answer_to_questions
      );

      const [errQuestionnaire, questionnaire] =
        await this.questionnaireRepository.getDetailQuestionnaire(
          questionnaireId
        );
      if (errQuestionnaire) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = product.toString();
        throw this.error;
      }
      // Stated migration question
      productId = (product as any)._id;
      await this.productRepository.updateMigrationFlagInProductModel(
        productId,
        'STARTED'
      );
      let initialScore = 100;

      const newQuestions = (questionnaire as any).questions;
      for (let q = 0; q < newQuestions.length; q++) {
        const newQuestion = newQuestions[q];
        if (newQuestion.type === 'yes-no-without-options') {
          initialScore = await this.mappingYesNoWithoutOptionsType(
            newQuestion,
            oldQuestionsArray,
            product,
            initialScore
          );
          continue;
        }
        if (newQuestion.type === 'yes-no-with-options') {
          initialScore = await this.mappingYesNoWithOptionsType(
            newQuestion,
            oldQuestionsArray,
            product,
            initialScore
          );
          continue;
        }
        if (newQuestion.type === 'dropdown') {
          initialScore = await this.mappingDropdownType(
            newQuestion,
            oldQuestionsArray,
            product,
            initialScore
          );
          continue;
        }
        continue;
      }
      const [errUpdatedProduct, updatedProduct] =
        await this.productRepository.updateMigrationFlagInProductModel(
          (product as any)._id,
          'COMPLETED'
        );
      if (errUpdatedProduct) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = updatedProduct.toString();
        throw this.error;
      }
      return updatedProduct;
    } catch (exception) {
      if (productId) {
        await this.productRepository.updateMigrationFlagInProductModel(
          (productId as any)._id,
          'ERROR'
        );
      }
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

  async changeProductImageUrls(
    numRecords: number,
    from?: string,
    to?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    const cdnPath = to || process.env.IMAGES_AWS_S3_ENDPOINT_CDN;
    if (!cdnPath) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: [],
          message:
            'The environment IMAGES_AWS_S3_ENDPOINT_CDN must be set correctly in order to user this API',
        },
      ];
    }

    return await this.productRepository.changeImageProductUrls(
      numRecords,
      from,
      cdnPath
    );
  }
}
