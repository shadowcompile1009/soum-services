import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { QuestionnaireInput } from '../../../src/models/Questionnaire';
import { QuestionnaireRepository } from '../../../src/repositories/questionnaireRepository';
import { UserRepository } from '../../../src/repositories/userRepository';
import { createQuestionnaire } from '../../_data/questionnaire';
const baseURL = '/rest/api/v1';

// let token: string;
let adminToken: string;
beforeAll(async () => {
  const [err1, authResult] = await Container.get(
    UserRepository
  ).verifyAdminUser('t.nguyen@soum.sa', '', '123456', '');
  if (!err1) {
    adminToken = authResult.result.token;
  }
});

afterAll(async () => {});

describe('POST /rest/api/v1/questionnaire', () => {
  test('should return 200 get all questionnaire with admin token successful', async () => {
    const response = await request(app)
      .get(baseURL + '/questionnaire')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
  });

  test('should return 201 create questionnaire successful', async () => {
    const mockGetOrderDataForInvoice = jest.spyOn(
      Container.get(QuestionnaireRepository),
      'addQuestionnaire'
    );
    mockGetOrderDataForInvoice.mockImplementation(
      (questionnaireInput: QuestionnaireInput) => {
        expect(questionnaireInput.is_active).toBe(true);
        return Promise.resolve([false, createQuestionnaire]);
      }
    );
    const response = await request(app)
      .post(baseURL + '/questionnaire')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        category_id: '60661c60fdc090d1ce2d4914',
        brand_id: '6069faf484541d77f553167a',
        model_id: '606b5f429537c01e0dd3baa7',
        description_en: 'Questionnaire for Mobile Apple Iphone 8',
        description_ar: 'استبيان لأجهزة الكمبيوتر المحمول',
        is_active: true,
      });
    console.log(response.body.message);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.QUESTIONNAIRE_CREATED_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData.description_en).toEqual(
      'Questionnaire for Mobile Apple Iphone 8'
    );
  });

  test('should return 400 with missing brand category device model', async () => {
    const response = await request(app)
      .post(baseURL + '/questionnaire')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        description_en: 'Questionnaire for Mobile Apple(Laptop) Iphone 8',
        description_ar: 'استبيان لأجهزة الكمبيوتر المحمول',
        is_active: true,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeNull();
    expect(response.body.responseData).toBeNull();
  });
});

// describe('PUT /rest/api/v1/questionnaire/:questionnaireId', () => {
//   test('should return 200 update questionnaire successful', async () => {
//     const response = await request(app)
//       .put(baseURL + `/questionnaire/${newQuestionnaireId}`)
//       .set('Accept', 'application/json')
//       .set({
//         token: adminToken,
//         'client-id': 'admin-web',
//       })
//       .send({
//         category_id: category_id,
//         brand_id: brand_id,
//         model_id: model_id,
//         description_en: 'Questionnaire for Mobile Apple Iphone 8 for updating',
//         description_ar: 'استبيان لأجهزة الكمبيوتر المحمول',
//         is_active: true,
//       });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual(
//       Constants.MESSAGE.QUESTIONNAIRE_UPDATED_SUCCESS
//     );
//     expect(response.body.responseData).not.toBeNull();
//     expect(response.body.responseData.description_en).toEqual(
//       'Questionnaire for Mobile Apple Iphone 8 for updating'
//     );
//   });
// });

// describe('POST /rest/api/v1/questionnaire/filter', () => {
//   test('should return 200 get questionnaire successful', async () => {
//     const response = await request(app)
//       .post(baseURL + '/questionnaire/filter')
//       .set('Accept', 'application/json')
//       .set({
//         token: adminToken,
//         'client-id': 'admin-web',
//       })
//       .send({
//         category_id: category_id,
//         brand_id: brand_id,
//         model_id: model_id,
//       });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual(
//       Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS
//     );
//     expect(response.body.responseData).not.toBeNull();
//     expect(response.body.responseData.length).toBeGreaterThan(0);
//   });
// });

// describe('PUT /rest/api/v1/questionnaire/:questionnairId/question/:questionId', () => {
//   beforeAll(async () => {
//     const newQuestion: QuestionInput = {
//       questionnaire_id: newQuestionnaireId,
//       question_ar: 'Is there any screen or body problem for testing?',
//       question_en: 'هل هناك أي مشكلة في الشاشة أو الجسم?',
//       type: 'yes-no-with-options',
//       order: 1,
//       answers: [
//         {
//           answer_en: 'Yes',
//           answer_ar: 'نعم',
//           question_id: null,
//           score: 0,
//           icon: 'string',
//           sub_choices: [
//             {
//               option_en: 'Visable/black/dead pixels test for testing',
//               option_ar: 'بكسل مرئي / أسود / ميت',
//               score: -2.5,
//               icon: 'string',
//             },
//           ],
//         },
//       ],
//     };
//     const [err3, result] = await Container.get(
//       QuestionnaireRepository
//     ).addQuestionOfQuestionnaire(newQuestion);
//     if (!err3) {
//       newQuestionId = result._id;
//       newAnswerId = result.answers[0]._id;
//       newSubChoiceId = result.answers[0].sub_choices[0];
//     }
//   });

//   afterAll(async () => {
//     await Choice.deleteOne({
//       _id: new mongoose.Types.ObjectId(newSubChoiceId),
//     }).exec();
//     await Answer.deleteOne({
//       _id: new mongoose.Types.ObjectId(newAnswerId),
//     }).exec();
//     await Question.deleteOne({
//       _id: new mongoose.Types.ObjectId(newQuestionId),
//     }).exec();
//   });

//   test('should return 200 update question successful', async () => {
//     const response = await request(app)
//       .put(
//         baseURL +
//           `/questionnaire/${newQuestionnaireId}/question/${newQuestionId}`
//       )
//       .set('Accept', 'application/json')
//       .set({
//         token: adminToken,
//         'client-id': 'admin-web',
//       })
//       .send({
//         order: 1,
//         question_en: 'Is there any screen or body problem for testing 123?',
//         question_ar: 'هل هناك أي مشكلة في الشاشة أو الجسم?',
//         type: 'yes-no-with-options',
//         answers: [
//           {
//             answer_id: newAnswerId,
//             answer_en: 'Yes',
//             answer_ar: 'نعم',
//             score: 1,
//             icon: 'https://iconup1.com',
//             sub_choices: [
//               {
//                 choice_id: newSubChoiceId,
//                 option_en: 'Visable/black/dead pixels for testing',
//                 option_ar: 'بكسل مرئي / أسود / ميت',
//                 score: -2.5,
//                 icon: 'https://iconsup.com',
//               },
//             ],
//           },
//         ],
//       });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual(
//       Constants.MESSAGE.QUESTION_UPDATED_SUCCESS
//     );
//     expect(response.body.responseData).not.toBeNull();
//     expect(response.body.responseData.question_en).toEqual(
//       'Is there any screen or body problem for testing 123?'
//     );
//   });
//   test(
//     'should return 200 update question successful, if you pass wrong answer id of the question,' +
//       "it won't update the answer or choice",
//     async () => {
//       const response = await request(app)
//         .put(
//           baseURL +
//             `/questionnaire/${newQuestionnaireId}/question/${newQuestionId}`
//         )
//         .set('Accept', 'application/json')
//         .set({
//           token: adminToken,
//           'client-id': 'admin-web',
//         })
//         .send({
//           order: 1,
//           question_en:
//             'Is there any screen or body problem for testing 123456?',
//           question_ar: 'هل هناك أي مشكلة في الشاشة أو الجسم?',
//           answers: [
//             {
//               answer_id: '6134eefa0e82cb2b94b7abcd',
//               answer_en: 'Yes',
//               answer_ar: 'نعم',
//               score: 1,
//               icon: 'https://iconup1.com',
//               sub_choices: [
//                 {
//                   choice_id: newSubChoiceId,
//                   option_en: 'Visable/black/dead pixels for testing 123',
//                   option_ar: 'بكسل مرئي / أسود / ميت',
//                   score: -2.5,
//                   icon: 'https://iconsup.com',
//                 },
//               ],
//             },
//           ],
//         });

//       expect(response.statusCode).toBe(200);
//       expect(response.body.message).toEqual(
//         Constants.MESSAGE.QUESTION_UPDATED_SUCCESS
//       );
//       expect(response.body.responseData).not.toBeNull();
//       expect(response.body.responseData.question_en).toEqual(
//         'Is there any screen or body problem for testing 123456?'
//       );
//     }
//   );
//   test("should return 200 update dropdown question successful", async () => {
//     const response = await request(app).put(baseURL
//       + "/questionnaire/61373938cd843e87f0169992/question/61373d6e463c6c99482bd584")
//       .set('Accept', 'application/json')
//       .set({
//         "token": token
//       })
//       .send({
//         "order": 4,
//         "question_en": "Is there any functional problem? Update",
//         "question_ar": "هل هناك أي مشكلة وظيفية؟",
//         "choices": [
//           {
//             "choice_id": "61373d6e463c6c99482bd585",
//             "option_en": "Yes update",
//             "option_ar": "نعم Update",
//             "score": -3,
//             "icon": ""
//           },
//           {
//             "choice_id": "61373d6e463c6c99482bd586",
//             "option_en": "No update",
//             "option_ar": "نعم Update",
//             "score": 1,
//             "icon": ""
//           }
//         ]
//       });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual(Constants.MESSAGE.QUESTION_UPDATED_SUCCESS);
//     expect(response.body.responseData).not.toBeNull();
//     expect(response.body.responseData.question_en)
//       .toEqual('Is there any functional problem? Update');
//   });
// });

// describe("DELETE /rest/api/v1/questionnaire/:questionnairId/question/:questionId", () => {
//   test("should return 200 remove question successful", async () => {
//     const response = await request(app).delete(baseURL
//       + "/questionnaire/612f1ffbc6ca3b34fa32863a/question/6134e9e246cee22a586b3aed")
//       .set('Accept', 'application/json')
//       .set({
//         "token": token
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toEqual(Constants.MESSAGE.QUESTION_REMOVED_SUCCESS);
//   });
//   test("should return 400 remove question not found", async () => {
//     const response = await request(app).delete(baseURL
//       + "/questionnaire/6121f869621f5b3c0c39d62c/question/612c5ba2d3732e06308e0f69")
//       .set('Accept', 'application/json')
//       .set({
//         "token": token
//       });
//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toEqual(Constants.MESSAGE.QUESTION_GET_NOT_FOUND);
//     expect(response.body.responseData).toBeNull();
//   });
// });
