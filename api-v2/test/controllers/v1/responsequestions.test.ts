import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { ProductModel } from '../../../src/models/LegacyProducts';
import { Response } from '../../../src/models/Response';
import { UserRepository } from '../../../src/repositories/userRepository';
import { generateJWT } from '../../../src/util/authentication';
import { getTestingUser } from '../../_data/user';

const baseURL = '/rest/api/v1';

let token: string;
let responseId: string;
let productId: string;

beforeAll(async () => {
  const mockGetTestingUserAccountForResponse = jest.spyOn(
    Container.get(UserRepository),
    'findNotDeletedUserByMobile'
  );
  mockGetTestingUserAccountForResponse.mockImplementation(
    (countryCode: string, phoneNumber: string) => {
      expect(countryCode).toEqual('966');
      expect(phoneNumber).toEqual('11111111111');
      return Promise.resolve([
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: getTestingUser },
      ]);
    }
  );
  const [err2, authUser] = await Container.get(
    UserRepository
  ).findNotDeletedUserByMobile('966', '11111111111');
  if (!err2) {
    const user = authUser.result;
    token = generateJWT(user);
  }

  const response: any = await Response.findOne().exec();
  responseId = response._id;
  const product: any = await ProductModel.findOne({
    response: { $ne: null },
  }).exec();
  productId = product._id;
});

describe('GET /rest/api/v1/response', () => {
  test('should return 200 OK', async () => {
    const response = await request(app)
      .get(baseURL + `/response/${responseId}`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'client-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData._id).toBe(responseId.toString());
  });

  test('should return 400 Bad Request', async () => {
    const response = await request(app)
      .get(baseURL + '/response/6139cb10df9eba48ec21d080')
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'client-web',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations[0].message).toBe("Response's not found");
  });
});

describe('GET /rest/api/v1/response/filter', () => {
  test('should return 200 OK with valid product id', async () => {
    const response = await request(app)
      .get(baseURL + `/response/filter/${productId}`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'client-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });

  test('should return 400 Bad Request with invalid product id', async () => {
    const response = await request(app)
      .get(baseURL + '/response/filter/123456')
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'client-web',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations[0].message).toBe('Fail to get response');
  });
});

// describe("PUT /rest/api/v1/response/{responseId}", () => {
//   test("should return 200 OK with valid new response created", async () => {
//     const response = await request(app).put(baseURL + "/response/614eddd087529e001f8322dc")
//       .set('Accept', 'application/json')
//       .set({
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
//           "eyJpZCI6IjYxMmRkYjE2MDg5ZDc1MjhkM2E2ZmEyMiIsImlhdCI6MTYzMTAwNzM4NSwi" +
//           "ZXhwIjoxNjMzNTk5Mzg1fQ.5byciTrTEgINRZmJFfVJew_btr6kphN9qEiOWeyeM1U"
//       })
//       .send({
//         "product_id": "60704534749f88724642b99b",
//         "responses": [
//           {
//             "question_id": "61432bd6f493256f045d46ce",
//             "answer_ids": [
//               {
//                 "answer_id": "61432bd6f493256f045d46cf",
//                 "sub_choices": [
//                   "61432bd6f493256f045d46d9"
//                 ]
//               }
//             ],
//             "choices": []
//           }
//         ]
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toEqual("success");
//   });

//   test("should return 400 with invalid reponseId", async () => {
//     const response = await request(app).put(baseURL + "/response/613b3250decdeb19084fb3d1")
//       .set('Accept', 'application/json')
//       .set({
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
//           "eyJpZCI6IjYxMmRkYjE2MDg5ZDc1MjhkM2E2ZmEyMiIsImlhdCI6MTYzMTAwNzM4NSwi" +
//           "ZXhwIjoxNjMzNTk5Mzg1fQ.5byciTrTEgINRZmJFfVJew_btr6kphN9qEiOWeyeM1U"
//       })
//       .send({
//         "product_id": "6139af921362ca6328797a0f",
//         "responses": [
//           {
//             "question_id": "613a556fcafdda002b703d46",
//             "answer_ids": [],
//             "choices": ["613a556fcafdda002b703d48"]
//           },
//           {
//             "question_id": "613898cf1b2fce001f85491f",
//             "answer_ids": [
//               {
//                 "answer_id": "613898cf1b2fce001f854920",
//                 "sub_choices": [
//                   "613898cf1b2fce001f854923"
//                 ]
//               }
//             ],
//             "choices": []
//           }
//         ]
//       });
//     expect(response.statusCode).toBe(400);
//     expect(response.body.status).toEqual("fail");
//     expect(response.body.violations[0].message).toEqual("Response's not found");
//   })
// });
