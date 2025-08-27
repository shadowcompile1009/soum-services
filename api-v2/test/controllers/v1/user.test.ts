import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { UserRepository } from '../../../src/repositories/userRepository';
import { AddressRepository } from '../../../src/repositories/addressRepository';
import { generateJWT } from '../../../src/util/authentication';
import { Constants } from '../../../src/constants/constant';
import {
  getAddressUser,
  getEmptyAddressUser,
  getUserViaId,
  checkExistingAddress,
  getTestingUser,
} from '../../_data/user';
import { AdminRepository } from '../../../src/repositories/adminRepository';
import { AdminDocument } from '../../../src/models/Admin';

const baseURL = '/rest/api/v1';
// const graphURL = "/graphql";

let token: string;
let adminToken = '';
let adminUser: AdminDocument;
beforeAll(async () => {
  const mockGetTestingUserAccount = jest.spyOn(
    Container.get(UserRepository),
    'findNotDeletedUserByMobile'
  );
  mockGetTestingUserAccount.mockImplementation(
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

  const [adminErr, authAdmin] = await Container.get(
    AdminRepository
  ).findOrCreateNew('m.duong@soum.sa');

  if (!adminErr) {
    adminUser = authAdmin.result;
    adminToken = generateJWT(adminUser, '', true);
  }
});

afterAll(async () => {});

describe('GET /rest/api/v1/user/my-sell-product', () => {
  test('should return 200 OK', async () => {
    const response = await request(app)
      .get(baseURL + '/user/my-sell-products')
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'client-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
  });

  test('should return 400 Bad Request', async () => {
    const response = await request(app)
      .get(baseURL + '/user/my-sell-products')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No token provided.');
  });
});

describe('GET rest/api/v1/user/:id/address', () => {
  test('should return 400 when invalid user id format more than 12 chars passed in', async () => {
    const response = await request(app)
      .get(baseURL + '/user/61123afc80d3805c7829ff651/address')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body.message).toContain('Invalid User Id');
  });

  test('should return 200 when valid user id that has address', async () => {
    const mockGetAddressOfUser = jest.spyOn(
      Container.get(AddressRepository),
      'getUserAddress'
    );
    mockGetAddressOfUser.mockImplementation((userId: string) => {
      expect(userId).toEqual('6057280c7b6600be053415d6');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getAddressUser as any,
          message: 'Get user address successful',
        },
      ]);
    });

    const response = await request(app)
      .get(baseURL + `/user/6057280c7b6600be053415d6/address`)
      .set('Accept', 'application/json');
    expect(response.body).toBeDefined();
    expect(response.body.status).toEqual('success');
  });

  test('should return 200 when valid user id that has no address', async () => {
    const mockGetEmptyAddressOfUser = jest.spyOn(
      Container.get(AddressRepository),
      'getUserAddress'
    );
    mockGetEmptyAddressOfUser.mockImplementation((userId: string) => {
      expect(userId).toEqual('6054c75f331bb603c4321b2e');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getEmptyAddressUser as any,
          message: 'Get user address successful',
        },
      ]);
    });
    const response = await request(app)
      .get(baseURL + `/user/6054c75f331bb603c4321b2e/address`)
      .set('Accept', 'application/json');
    expect(response.body).toBeDefined();
    expect(response.body.responseData).toEqual([]);
    expect(response.body.status).toEqual('success');
  });
});

describe('POST rest/api/v1/user/:id/address', () => {
  test('should return 201 when address is added for a user with minimum required fields', async () => {
    const mockGetUserAddress = jest.spyOn(
      Container.get(UserRepository),
      'getUserAddress'
    );
    mockGetUserAddress.mockImplementation((userId: string, fields: string) => {
      expect(userId).toEqual('6054c75f331bb603c4321b2e');
      expect(fields).toEqual('_id name address addresses');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getUserViaId as any,
        },
      ]);
    });

    const mockCheckSameExistingUserAddress = jest.spyOn(
      Container.get(AddressRepository),
      'checkSameExistingUserAddress'
    );
    mockCheckSameExistingUserAddress.mockImplementation((userId: string) => {
      expect(userId).toEqual('6054c75f331bb603c4321b2e');
      return Promise.resolve(checkExistingAddress as any);
    });

    const response = await request(app)
      .post(baseURL + `/user/6054c75f331bb603c4321b2e/address`)
      .set('Content-Type', 'application/json')
      .send({
        street: 'HaiPhong',
        district: 'HaiChau',
        city: 'Danang',
        postal_code: '50000',
        longitude: '123',
        latitude: '456',
        is_default: true,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toContain(
      'User address is added successfully'
    );
    expect(response.body.responseData).toBeDefined();
  });

  test('should return 400 when invalid user id passed', async () => {
    const response = await request(app)
      .post(baseURL + '/user/61123afc80d3805c7829ff651/address')
      .set('Content-Type', 'application/json')
      .send({
        street: 'HaiPhong',
        district: 'HaiChau',
        city: 'Danang',
        postal_code: '50000',
        longitude: '123',
        latitude: '456',
        is_default: true,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body.message).toContain('Invalid User Id');
  });
});

// describe('PUT rest/api/v1/user/:id/addresses', () => {
//   test('should return 200 when address is updated for a user', async () => {
//     const response = await request(app)
//       .put(baseURL + `/user/${userId}/addresses/${fullAddressId}`)
//       .set('Content-Type', 'application/json')
//       .send({
//         address: 'test',
//         is_default: true,
//         longitude: '1232141.43',
//         latitude: '35435435',
//         city: 'Jeddah',
//         neighborhood: 'neighbor1',
//         villa: 'Villa2',
//         province: 'Province 2',
//         postal_code: '1232136',
//         state: 'State 2',
//         country: 'Saudi Arabia',
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBeDefined();
//     expect(response.body.message).toContain(
//       'User address is update successfully'
//     );
//     expect(response.body.responseData).toBeDefined(); // Return User with all fields and addresses
//   });

//   test('should return 400 when invalid user id passed', async () => {
//     const response = await request(app)
//       .put(baseURL + `/user/61123afc80d3805c7829ff651/addresses/${addressId}`)
//       .set('Content-Type', 'application/json')
//       .send({
//         city: 'Jeddah',
//         neighborhood: 'neighbor1',
//         country: 'Saudi Arabia',
//       });
//     expect(response.statusCode).toBe(400);
//     expect(response.body).toBeDefined();
//     expect(response.body.message).toContain('Invalid User Id');
//   });
// });

// describe("POST /graphql getAddresses", () => {

//   it("should return 200 with addresses info of the valid user id", (done) => {
//   request(app).post(graphURL)
//     .send({
//       operationName: "GetAddressesTest",
// eslint-disable-next-line max-len
//       query: "query GetAddressesTest($userVar: String) { getAddresses(userId: $userVar) { address neighborhood villa city country province postal_code state }}",
//       variables: {
//         userVar: "61123afc80d3805c7829ff65"
//       }
//     })
//     .expect('Content-Type', /json/)
//     .expect(200)
//     .end(() => {
//       done();
//     })
//   });
// });

// describe('PUT /rest/api/v1/user/{userId}/profile', () => {
//   test('should return 200 OK', async () => {
//     const response = await request(app)
//       .put(baseURL + `/user/${userId}/profile`)
//       .set('Content-Type', 'application/json')
//       .set({
//         token: token,
//         'client-id': 'client-web',
//       })
//       .send({
//         email_address: 'testdata113@yopmail.com',
//         password: 'testing@A12',
//         first_name: 'testing',
//         last_name: 'dev',
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBeDefined();
//     expect(response.body.responseData).toContain('User account is updated');
//   });
// });

// describe('POST /rest/api/v1/user/wishlist', () => {
//   test('should return 401 when token is expired', async () => {
//     const response = await request(app)
//       .post(baseURL + '/user/wishlist')
//       .set('Accept', 'application/json')
//       .set({
//         token:
//           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
//           'eyJpYXQiOjE2MjkzNTg3MTMsImV4cGlyZXNJbiI6NDMyMCwiaXAiOiI6OjEiLCJl' +
//           'bWFpbF9hZGRyZXNzIjoidGVzdGVyQHlvcG1haWwuY29tIiwidXNlcm5hbWUiOiJ0ZXN0' +
//           'ZXIiLCJpZCI6IjYxMTBlZjY5OWZlNjk4MTA4YzA4NTQ5MCJ9.HvyR0DQTooBTElpTkkfqJaeZ4P81tmnKDewHxd0Ibi4',
//       })
//       .send('{"product_id": "611a4942b4fc49a59f324bae"}');
//     expect(response.statusCode).toBe(401);
//     expect(response.body.status).toEqual('fail');
//     expect(response.body.responseData).toEqual(null);
//   });
// });

// ======= START GET USERS =======
async function getUser(query: any): Promise<any> {
  return await request(app)
    .get(baseURL + `/user`)
    .set({
      token: adminToken,
      'client-id': 'admin-web',
    })
    .query(query);
}

describe('GET /rest/api/v1/user', () => {
  test('should return 200 when get users with valid information (get all users)', async () => {
    const response = await getUser({
      page: 1,
      size: 20,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body?.message).toEqual('Get users successfully');
    expect(response.body?.responseData?.code).toBe(200);
    expect(
      response.body?.responseData?.result?.totalResult
    ).toBeGreaterThanOrEqual(1);
    expect(response.body?.responseData?.result?.data).toBeDefined();
  });

  test('should return 200 when get users with valid information (get all un-active users)', async () => {
    const response = await getUser({
      page: 1,
      size: 20,
      isGetInactiveUser: true,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body?.message).toEqual('Get users successfully');
    expect(response.body?.responseData?.code).toBe(200);
    expect(
      response.body?.responseData?.result?.totalResult
    ).toBeGreaterThanOrEqual(1);
    expect(response.body?.responseData?.result?.data).toBeDefined();
  });

  test('should return 400 when enter invalid params (page is not a number)', async () => {
    const response = await getUser({
      page: '1a',
      size: 20,
      isGetInactiveUser: true,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('page is not number type');
  });

  test('should return 400 when enter invalid params (size is not a number)', async () => {
    const response = await getUser({
      page: 1,
      size: 'a20',
      isGetInactiveUser: true,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('size is not number type');
  });

  test('should return 400 when enter invalid params (isGetInactiveUser is boolean)', async () => {
    const response = await getUser({
      page: 1,
      size: 20,
      isGetInactiveUser: 'trueabc',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'isGetInactiveUser is not boolean type'
    );
  });

  test('should return 400 when enter invalid params (isGetBetaUser is boolean)', async () => {
    const response = await getUser({
      page: 1,
      size: 20,
      isGetInactiveUser: true,
      isGetBetaUser: 'true1',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'isGetBetaUser is not boolean type'
    );
  });

  test('should return 400 when enter invalid params (isGetKeySeller is boolean)', async () => {
    const response = await getUser({
      page: 1,
      size: 20,
      isGetInactiveUser: true,
      isGetKeySeller: 'true1',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'isGetKeySeller is not boolean type'
    );
  });
});
// ======= END GET USERS =======
