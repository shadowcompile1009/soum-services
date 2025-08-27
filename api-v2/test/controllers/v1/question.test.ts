import mongoose from 'mongoose';
import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { Answer } from '../../../src/models/Answer';
import { Choice } from '../../../src/models/Choice';
import { Question } from '../../../src/models/Question';
import { UserRepository } from '../../../src/repositories/userRepository';

const baseURL = '/rest/api/v1';

let token: string;
let yesNoQuestionId: string;
let mcqQuestionId: string;
let answerId: string;
let choiceId: string;

beforeAll(async () => {
  const [err1, authResult] = await Container.get(
    UserRepository
  ).verifyAdminUser('t.nguyen@soum.sa', '', '123456', '');
  if (!err1) {
    token = authResult.result.token;
  }

  const yesNoQuestion: any = await Question.findOne({
    type: 'yes-no-with-options',
  }).exec();
  yesNoQuestionId = yesNoQuestion.id;
  const mcqQuestion: any = await Question.findOne({ type: 'dropdown' }).exec();
  mcqQuestionId = mcqQuestion.id;
});

afterAll(async () => {
  const question: any = await Question.findById(yesNoQuestionId).exec();
  question.answers = question.answers.filter((item: any) => item != answerId);
  await question.save();
  await Choice.deleteOne({ _id: new mongoose.Types.ObjectId(choiceId) }).exec();
  await Answer.deleteOne({ _id: new mongoose.Types.ObjectId(answerId) }).exec();
});

describe('POST /rest/api/v1/question/:questionId/answer', () => {
  test('should return 400 When question is not yes-no type', async () => {
    const response = await request(app)
      .post(baseURL + `/question/${mcqQuestionId}/answer`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        answer_en: 'Yes, Add new',
        answer_ar: 'نعم',
        score: 0,
        icon: 'https://test.com',
        sub_choices: [
          {
            option_en: 'Visable/black/dead pixels Add new',
            option_ar: 'بكسل مرئي / أسود / ميت Add new',
            score: -1,
            icon: 'https://test-icon.com',
          },
        ],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.ANSWER_NOT_FOR_QUESTION_TYPE_DROPDOWN_MCQ
    );
    expect(response.body.responseData).toBeNull();
  });
});

describe('PUT /rest/api/v1/question/:questionId/answer', () => {
  test('should return 400 When question is not found', async () => {
    const response = await request(app)
      .put(
        baseURL +
          '/question/613b6adbe219c8c626ff5d64/answer/613b6adbe219c8c626ff5d65'
      )
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        answer_en: 'Yes, Add new Update',
        answer_ar: 'نعم',
        score: 0,
        icon: 'https://test.com',
        sub_choices: [
          {
            _id: choiceId,
            option_en: 'Visable/black/dead pixels Add new',
            option_ar: 'بكسل مرئي / أسود / ميت Add new',
            score: -1,
            icon: 'https://test-icon.com',
          },
        ],
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.violations[0].message).toEqual(
      Constants.MESSAGE.FAILED_TO_UPDATE_ANSWER
    );
    expect(response.body.responseData).toBeNull();
  });

  test('should return 400 When answer is not found', async () => {
    const response = await request(app)
      .put(
        baseURL + `/question/${yesNoQuestionId}/answer/613b6adbe219c8c626ff5d65`
      )
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        answer_en: 'Yes, Add new Update',
        answer_ar: 'نعم',
        score: 0,
        icon: 'https://test.com',
        sub_choices: [
          {
            _id: choiceId,
            option_en: 'Visable/black/dead pixels Add new',
            option_ar: 'بكسل مرئي / أسود / ميت Add new',
            score: -1,
            icon: 'https://test-icon.com',
          },
        ],
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.violations[0].message).toEqual(
      Constants.MESSAGE.FAILED_TO_UPDATE_ANSWER
    );
    expect(response.body.responseData).toBeNull();
  });
});

/*describe('DELETE /rest/api/v1/question/:questionId/answer/:answerId', () => {
  test('should return 200 remove answer of question successful', async () => {
    const response = await request(app).delete(baseURL
      + `/question/6137d28e1b2fce001f854915/answer/613b6adbe219c8c626ff5d64`)
      .set('Accept', 'application/json')
      .set({
        'token': token,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(Constants.MESSAGE.ANSWER_REMOVED_SUCCESS);
  });
  test('should return 400 remove question not found', async () => {
    const response = await request(app).delete(baseURL
      + '/question/613b6adbe219c8c626ff5d64/answer/613b6adbe219c8c626ff5d64')
      .set('Accept', 'application/json')
      .set({
        'token': token,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(Constants.MESSAGE.QUESTION_GET_NOT_FOUND);
    expect(response.body.responseData).toBeNull();
  });
  test('should return 400 remove answer not found', async () => {
    const response = await request(app).delete(baseURL
      + '/question/6137d28e1b2fce001f854915/answer/6137d28e1b2fce001f854915')
      .set('Accept', 'application/json')
      .set({
        'token': token,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(Constants.MESSAGE.ANSWER_GET_NOT_FOUND);
    expect(response.body.responseData).toBeNull();
  });
}); */
