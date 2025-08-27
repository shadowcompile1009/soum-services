import { ResponseRepository } from '../../src/repositories/responseRepository';
import { ProductRepository } from '../../src/repositories/productRepository';
import { ErrorResponseDto } from '../../src/dto/errorResponseDto';
import { ResponseService } from '../../src/services/responseService';
import {
  mockTabletProductResponse,
  mobileQuestions,
  mobileAnswers,
  choices,
} from '../_data/questionnaire';
import { QuestionRepository } from '../../src/repositories/questionRepository';
import { AnswerRepository } from '../../src/repositories/answerRepository';
import { ChoiceRepository } from '../../src/repositories/choiceRepository';

describe('getFilterResponse', () => {
  beforeAll(() => {});

  test('return the answers of the questions of the products', async () => {
    const responseRepository = new ResponseRepository();
    const response: any = mockTabletProductResponse();
    responseRepository.getFilterResponse = jest.fn(() =>
      Promise.resolve([false, { code: 200, result: response }])
    );
    const productRepository = new ProductRepository();
    productRepository.findProductById = jest.fn((id: string) =>
      Promise.resolve({ id: id } as any)
    );
    const questionRepository = new QuestionRepository();
    questionRepository.getQuestionById = jest.fn((id: string) => {
      const foundQuestion: any = mobileQuestions.find(
        (question: any) => question._id === id
      );
      return Promise.resolve([false, { code: 200, result: foundQuestion }]);
    });
    const answerRepository = new AnswerRepository();
    answerRepository.getAnswerViaId = jest.fn((id: string) => {
      const foundAnswer: any = mobileAnswers.find(
        (answer: any) => answer._id === id
      );
      return Promise.resolve([false, { code: 200, result: foundAnswer }]);
    });
    const choiceRepository = new ChoiceRepository();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    choiceRepository.getChoiceViaListId = jest.fn(listIds => {
      let foundChoices: any = [];
      if (listIds.length > 0) {
        foundChoices = choices.filter(choice => listIds.includes(choice._id));
      }

      return Promise.resolve([
        false,
        { code: 200, result: foundChoices },
      ] as any);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    choiceRepository.getSubChoicesByIds = jest.fn(subChoicesIds =>
      Promise.resolve([false, []] as any)
    );
    const errorResponse = new ErrorResponseDto();
    const responseService = new ResponseService();
    responseService.responseRepository = responseRepository;
    responseService.productRepository = productRepository;
    responseService.questionRepository = questionRepository;
    responseService.answerRepository = answerRepository;
    responseService.choiceRepository = choiceRepository;
    responseService.error = errorResponse;

    const result = await responseService.getFilterResponse('fake_id');
    expect(result[0]).toBeFalsy();
    expect(result[1][3]).toEqual({
      question_id: '61432ea1f493256f045d46e8',
      question_type: 'dropdown',
      order: 5,
      question_en: 'Battery health',
      question_ar: 'صحة البطارية',
      answers: [],
      choices: [
        {
          choice_id: '61432ea1f493256f045d46eb',
          option_ar: '85-89',
          option_en: '85-89',
          icon: 'https://soum01.fra1.digitaloceanspaces.com/soum-prod/questions/mobile/charging-problem.png',
          score: -1.3,
        },
      ],
    });
  });

  test('New format of choice - return the answers of the questions of the products', async () => {
    const responseRepository = new ResponseRepository();
    const newResponse: any = mockTabletProductResponse(true);
    responseRepository.getFilterResponse = jest.fn(() =>
      Promise.resolve([false, { code: 200, result: newResponse }])
    );
    const productRepository = new ProductRepository();
    productRepository.findProductById = jest.fn((id: string) =>
      Promise.resolve({ id: id } as any)
    );
    const questionRepository = new QuestionRepository();
    questionRepository.getQuestionById = jest.fn((id: string) => {
      const foundQuestion: any = mobileQuestions.find(
        (question: any) => question._id === id
      );
      return Promise.resolve([false, { code: 200, result: foundQuestion }]);
    });
    const answerRepository = new AnswerRepository();
    answerRepository.getAnswerViaId = jest.fn((id: string) => {
      const foundAnswer: any = mobileAnswers.find(
        (answer: any) => answer._id === id
      );
      return Promise.resolve([false, { code: 200, result: foundAnswer }]);
    });
    const choiceRepository = new ChoiceRepository();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    choiceRepository.getChoiceViaListId = jest.fn(listIds => {
      let foundChoices: any = [];
      if (listIds.length > 0) {
        foundChoices = choices.filter(choice => listIds.includes(choice._id));
      }

      return Promise.resolve([
        false,
        { code: 200, result: foundChoices },
      ] as any);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    choiceRepository.getSubChoicesByIds = jest.fn(subChoicesIds =>
      Promise.resolve([false, []] as any)
    );
    const errorResponse = new ErrorResponseDto();
    const responseService = new ResponseService();
    responseService.responseRepository = responseRepository;
    responseService.productRepository = productRepository;
    responseService.questionRepository = questionRepository;
    responseService.answerRepository = answerRepository;
    responseService.choiceRepository = choiceRepository;
    responseService.error = errorResponse;

    const result = await responseService.getFilterResponse('fake_id');
    expect(result[0]).toBeFalsy();
    expect(result[1][3]).toEqual({
      question_id: '61432ea1f493256f045d46e8',
      question_type: 'dropdown',
      order: 5,
      question_en: 'Battery health',
      question_ar: 'صحة البطارية',
      answers: [],
      choices: [
        {
          choice_id: '61432ea1f493256f045d46eb',
          option_ar: '88',
          option_en: '88',
          icon: 'https://soum01.fra1.digitaloceanspaces.com/soum-prod/questions/mobile/charging-problem.png',
          score: -1.3,
        },
      ],
    });
  });
});
