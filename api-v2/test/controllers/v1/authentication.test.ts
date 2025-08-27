import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { AdminDocument } from '../../../src/models/Admin';
import { UserLegacyDocument } from '../../../src/models/LegacyUser';
import { AdminRepository } from '../../../src/repositories/adminRepository';
import { UserRepository } from '../../../src/repositories/userRepository';
import { generateJWT } from '../../../src/util/authentication';

const baseURL = '/rest/api/v1';
let token = '';
let user: UserLegacyDocument;
let adminUser: AdminDocument;
let adminToken = '';
beforeAll(async () => {
  const [err, authUser] = await Container.get(
    UserRepository
  ).findNotDeletedUserByMobile('966', '11111111122');
  if (!err) {
    user = authUser.result;
    token = generateJWT(user);
  }

  const [adminErr, authAdmin] = await Container.get(
    AdminRepository
  ).findOrCreateNew('m.duong@soum.sa');
  if (!adminErr) {
    adminUser = authAdmin.result;
    adminToken = generateJWT(adminUser, '', true);
  }
});

describe('POST /rest/api/v1/authentication/login', () => {
  test('should return 200 login success', async () => {
    const response = await request(app)
      .post(baseURL + '/authentication/login')
      .set({
        'client-id': 'admin-web',
      })
      .send({
        email: 'm.duong@soum.sa',
        password: '123456',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
  });

  test('should return 400 invalid credentials', async () => {
    const response = await request(app)
      .post(baseURL + '/authentication/login')
      .set({
        'client-id': 'admin-web',
      })
      .send({
        email: 'm.duong@soum.sa',
        password: '123123',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations[0].message).toBe(
      'Authentication failed. Wrong password.'
    );
  });
});

describe('GET /rest/api/v1/authentication/refresh', () => {
  test('should return 200 with refresh token', async () => {
    const response = await request(app)
      .get(baseURL + '/authentication/refresh')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
  });
});

describe('GET /rest/api/v1/authentication/logout', () => {
  test('should return 200 when logout success', async () => {
    const response = await request(app)
      .get(baseURL + '/authentication/logout')
      .set({
        token,
        'fcm-token': '',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.LOGOUT_SUCCESS.replace('%%user%%', user.mobileNumber)
    );
  });
});

// describe("GET /rest/api/v1/authentication/sendOTP", () => {
//     it("should return 200 with otp via request phone", (done) => {
//         request(app).get(baseURL + "/authentication/sendOTP")
//             .set("token", token)
//             .field("phone", "123456")
//             .expect(200)
//             .end(function () {
//                 done();
//             });
//     });
// });

// describe("GET /rest/api/v1/authentication/verifyOTP", () => {
//     it("should return 200 valid OTP", (done) => {
//         request(app).get(baseURL + "/authentication/verifyOTP")
//             .set("token", token)
//             .field("phone", "123456")
//             .field("hash", "323213144141414")
//             .field("otp", "203526")
//             .expect(200)
//             .end(function () {
//                 done();
//             });
//     });
// });
