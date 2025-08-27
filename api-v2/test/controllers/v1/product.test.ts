import mongoose from 'mongoose';
import request from 'supertest';
import { Container } from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { AdminDocument } from '../../../src/models/Admin';
import { ProductModel } from '../../../src/models/LegacyProducts';
import { LegacyUser } from '../../../src/models/LegacyUser';
import { AdminRepository } from '../../../src/repositories/adminRepository';
import { ProductRepository } from '../../../src/repositories/productRepository';
import { generateJWT } from '../../../src/util/authentication';
import { getDetailProduct } from '../../_data/Product';
import { Variant } from '../../../src/models/Variant';
import { jwtSignIn } from '../../../src/util/deltaMachineAuthentication';
import { UserJWTTokenInput } from '../../../src/models/DeltaMachineUsers';

const baseURL = '/rest/api/v1';
let adminUser: AdminDocument;
let adminToken = '';
let productId: string;
let userId: string;
let userToken: string;
let variantId: string;
let newVariantId: string;
beforeAll(async () => {
  const [, authAdmin] = await Container.get(AdminRepository).findOrCreateNew(
    'm.duong@soum.sa'
  );

  const user = await LegacyUser.findOne({
    status: 'Active',
    userType: 'Dummy',
  });
  userToken = user.token[0];
  userId = user._id.toString() || '';
  userToken = generateJWT(user, '', false);

  const result = await ProductModel.findOneAndUpdate(
    { status: 'Active', sell_status: 'Available' },
    { $set: { user_id: new mongoose.Types.ObjectId(userId) } },
    { new: true }
  )
    .populate('brand')
    .populate('category')
    .populate('devicemodel')
    .populate('color')
    .populate('varients')
    .populate({ path: 'promo_code', select: '_id code' })
    .exec();

  newVariantId = (
    await Variant.findOne({
      status: 'Active',
      category_id: result.category_id,
      brand_id: result.brand_id,
      model_id: result.model_id,
    })
  )?._id;

  if (result) {
    productId = result.id;
    variantId = result.varient_id;
  }

  adminUser = authAdmin.result;
  const adminId: UserJWTTokenInput = {
    id: adminUser._id,
  };
  adminToken = jwtSignIn(null, adminId);
});

/* describe('POST /rest/api/v1/product/filter', () => {
  test('should return 200 OK when no document matches with request', async () => {
    const response = await request(app).post(baseURL + '/product/filter')
      .send({
        'search': 'SSSSSSSSSSSS'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData).toEqual([]);
  });
  test('should return 200 OK when searching by status of product', async () => {
    const response = await request(app).post(baseURL + '/product/filter')
      .send({
        'search': 'Active'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });
  test('should return 200 OK when searching by status of product', async () => {
    const response = await request(app).post(baseURL + '/product/filter')
      .send({
        'search': 'Active',
        'categories': product.category_id,
        'models': product.model_id,
        'brands': product.brand_id,
        'page': 1,
        'size': 5
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });
}); */

describe('GET /rest/api/v1/product/{productId}', () => {
  test('should return 200 when getting detail product via valid id', async () => {
    const mockGetDetailProduct = jest.spyOn(
      Container.get(ProductRepository),
      'getDetailProduct'
    );
    mockGetDetailProduct.mockImplementation((productId: string) => {
      expect(productId).toEqual('60b7a5ab8c369e0a6a23e372');
      return Promise.resolve([
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: getDetailProduct },
      ]);
    });

    const response = await request(app)
      .get(baseURL + `/product/detail/60b7a5ab8c369e0a6a23e372`)
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
  });

  test('should return 400 when none of existing product matches with id', async () => {
    const response = await request(app)
      .get(baseURL + '/product/detail/611a4942b4fc49a59f324b11')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.responseData).toEqual(null);
    expect(response.body.violations[0].message).toEqual(
      'Fail to get detail product'
    );
  });
});

describe('GET /rest/api/v1/product', () => {
  test('should return 200 when getting all products', async () => {
    const response = await request(app)
      .get(baseURL + '/product')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.PRODUCT_GET_SUCCESS
    );
    expect(response.body.responseData.info.total).toBeDefined();
    expect(response.body.responseData.info.pages).toBeDefined();
    expect(response.body.responseData.results).toBeDefined();
    const length = response.body.responseData.results.length;
    expect(length).toBeGreaterThan(0);
  });
});

describe('GET /rest/api/v1/product', () => {
  test('should return 401 when token is expired', async () => {
    const response = await request(app)
      .get(baseURL + '/product/my/wishlist')
      .set('Accept', 'application/json')
      .set({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJpYXQiOjE2MjkzNTg3MTMsImV4cGlyZXNJbiI6NDMyMCwiaXAiOiI6OjEiLCJl' +
          'bWFpbF9hZGRyZXNzIjoidGVzdGVyQHlvcG1haWwuY29tIiwidXNlcm5hbWUiOiJ0ZXN0' +
          'ZXIiLCJpZCI6IjYxMTBlZjY5OWZlNjk4MTA4YzA4NTQ5MCJ9.HvyR0DQTooBTElpTkkfqJaeZ4P81tmnKDewHxd0Ibi4',
      });
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toEqual('fail');
    expect(response.body.responseData).toEqual(null);
  });

  test('should return 401 when missing token of authentication', async () => {
    const response = await request(app).get(baseURL + '/product/my/wishlist');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('No token provided.');
  });
});

describe('GET /rest/api/v1/product/{productId}/question/answer', () => {
  test('should return 200 when getting list question answer on product via valid id', async () => {
    const response = await request(app).get(
      baseURL + `/product/${productId}/question/answer`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData).toBeDefined();
  });
});

describe('GET /rest/api/v1/product/prerequisite', () => {
  test('should return the result of prerequisite validation of listing item with the products', async () => {
    const response = await request(app)
      .get(baseURL + '/product/prerequisite')
      .query({ userId: userId });
    if (userId) {
      if (response.statusCode === 200) {
        expect(response.body.message).toEqual(
          Constants.MESSAGE.PASSED_LISTING_CONDITION
        );
      } else {
        // expect(response.body.message).toEqual(Constants.MESSAGE.FAILED_LISTING_CONDITION);
        expect(response.body.message).not.toBeNull();
      }
    } else {
      expect(response.statusCode).toBe(Constants.ERROR_CODE.BAD_REQUEST);
      expect(response.body.message).toContain(
        'Cast to ObjectId failed for value'
      );
    }
  });
});

describe('GET /rest/api/v1/product/get-mpp-products/:modelId', () => {
  test('should return best product on top and normal MPP after then', async () => {
    const modelId = '6069fb8084541d07be53167b';
    const response = await request(app)
      .get(baseURL + '/product/get-mpp-products/' + modelId)
      .query({
        page: 1,
        size: 20,
        minPrice: 100,
        maxPrice: 5000,
        capacities: '128GB, 64GB',
        grades: 'exellent,great,good,extensive',
        userCity: 'Riyadh',
        sortDirection: 'ASC',
      });

    expect(response.statusCode).toBe(Constants.SUCCESS_CODE.SUCCESS);
  });
});

/* describe('POST /rest/api/v1/product/apply/promocode', () => {
  test('should return 200 when successfully applying promo code', async () => {
    const response = await request(app).post(baseURL + '/product/apply/promocode')
      .set('Accept', 'application/json')
      .set({
        'token': token,
        'client-id': 'admin-web'
      })
      .send({
        'promo_code': 'ABC123',
        'product_ids': '6110f7502abf62280804d072,611f1df72c9d5e7288887299'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData).toEqual('Done for applying code');
  })
  test('should return 400 with invalid promo code', async () => {
    const response = await request(app).post(baseURL + '/product/apply/promocode')
      .set('Accept', 'application/json')
      .set({
        'token': token,
        'client-id': 'admin-web',
      })
      .send({
        'promo_code': '123456',
        'product_ids': '6110f7502abf62280804d072,611f1df72c9d5e7288887299'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations).not.toEqual(null);
  })
}) */
// ======= START GET NUMBER OF BETTER PRICE LISTINGS =======
describe('GET /rest/api/v1/product/countBetterPriceListings', () => {
  test('should return 200 when counting better price listings with valid query', async () => {
    const response = await request(app)
      .get(
        baseURL +
          `/product/countBetterPriceListings?variantId=${newVariantId}&score=98&listingPrice=10000`
      )
      .set({
        token: userToken,
        'client-id': 'client-web',
      });
    expect(response?.statusCode).toBe(200);
    expect(response?.body?.responseData).toBeGreaterThanOrEqual(0);
  });

  test('should return 400 when variantId is invalid', async () => {
    const response = await request(app)
      .get(
        baseURL +
          `/product/countBetterPriceListings?variantId=11111111111111111111111&score=98&listingPrice=10000`
      )
      .set({
        token: userToken,
        'client-id': 'client-web',
      });
    expect(response?.statusCode).toBe(400);
    expect(response.body?.message).toContain(
      'Wrong ID format, please try again'
    );
  });

  test('should return 400 when score < 0 || score > 100', async () => {
    const response = await request(app)
      .get(
        baseURL +
          `/product/countBetterPriceListings?variantId=${newVariantId}&score=-1&listingPrice=10000`
      )
      .set({
        token: userToken,
        'client-id': 'client-web',
      });
    expect(response?.statusCode).toBe(400);
    expect(response.body?.message).toContain(
      'score must be a number from 0 to 100'
    );
  });
  test('should return 400 when score < 0 || score > 100', async () => {
    const response = await request(app)
      .get(
        baseURL +
          `/product/countBetterPriceListings?variantId=${newVariantId}&score=101&listingPrice=10000`
      )
      .set({
        token: userToken,
        'client-id': 'client-web',
      });
    expect(response?.statusCode).toBe(400);
    expect(response.body?.message).toContain(
      'score must be a number from 0 to 100'
    );
  });
  test('should return 400 when listingPrice < 0', async () => {
    const response = await request(app)
      .get(
        baseURL +
          `/product/countBetterPriceListings?variantId=${newVariantId}&score=10&listingPrice=-1`
      )
      .set({
        token: userToken,
        'client-id': 'client-web',
      });
    expect(response?.statusCode).toBe(400);
    expect(response.body?.message).toContain(
      'listingPrice must be a number and over than 0'
    );
  });
});
// ======= END GET NUMBER OF BETTER PRICE LISTINGS =======

// ======= START EDIT PRICE =======
describe('PUT /rest/api/v1/product/update-price/{productId}', () => {
  test('should return 200 when updating price of a product with valid information', async () => {
    const response = await request(app)
      .put(baseURL + `/product/update-price/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 50,
        variant_id: variantId,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body?.responseData?.result?._id).toEqual(`${productId}`);
    expect(response.body?.responseData?.result?.sell_price).toEqual(50);
  });

  test('should return 400 when missing required field (sell_price)', async () => {
    const response = await request(app)
      .put(baseURL + `/product/update-price/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        variant_id: variantId,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'Sell price must have a value or must be a positive number'
    );
  });

  test('should return 400 when missing required field (model_id)', async () => {
    const response = await request(app)
      .put(baseURL + `/product/update-price/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 50,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('variant_id is empty/null value');
  });

  test('should return 400 when the updated price is higher than the max available price', async () => {
    const response = await request(app)
      .put(baseURL + `/product/update-price/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 99999,
        variant_id: variantId,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'Wrong sell price, sell price exceed maximum possible pice'
    );
    expect(response.body?.responseData).toBeNull();
  });

  test('should return 400 when no matched product found (wrong product ID)', async () => {
    const response = await request(app)
      .put(baseURL + `/product/update-price/111111111111111111111111`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 50,
        variant_id: variantId,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('DATA_NOT_FOUND');
  });
});
// ======= END EDIT PRICE =======

// ======= VALIDATE PRODUCT DATA BEFORE BUYING =======
describe('POST /rest/api/v1/product/validate-sell-data/{productId}', () => {
  test('should return 200 when updating price of a product with valid information', async () => {
    const response = await request(app)
      .post(baseURL + `/product/validate-sell-data/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 50,
        status: 'Active',
        sell_status: 'Available',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Product validated successfully');
    expect(response.body?.responseData?.result?.id).toEqual(`${productId}`);
    expect(response.body?.responseData?.result?.sell_price).toEqual(50);
    expect(response.body?.responseData?.result?.status).toEqual('Active');
    expect(response.body?.responseData?.result?.sell_status).toEqual(
      'Available'
    );
  });

  test('should return 400 when missing required field (sell_price)', async () => {
    const response = await request(app)
      .post(baseURL + `/product/validate-sell-data/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        status: 'Active',
        sell_status: 'Available',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('Sell price must have a value');
  });

  test('should return 400 when missing required field (status)', async () => {
    const response = await request(app)
      .post(baseURL + `/product/validate-sell-data/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 50,
        sell_status: 'Available',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('status is empty/null value');
  });

  test('should return 400 when missing required field (sell_status)', async () => {
    const response = await request(app)
      .post(baseURL + `/product/validate-sell-data/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 50,
        status: 'Active',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('sell_status is empty/null value');
  });

  test('should return 400 when no matched products found', async () => {
    const response = await request(app)
      .post(baseURL + `/product/validate-sell-data/${productId}`)
      .set({
        token: userToken,
      })
      .send({
        sell_price: 1112,
        status: 'Active',
        sell_status: 'Available',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toEqual(
      'No matched products, please reload'
    );
    expect(response.body?.responseData).toBeNull();
  });
});
// ======= VALIDATE PRODUCT DATA BEFORE BUYING =======

// ======= START REJECT PRODUCT BY ID =======
describe('PUT /rest/api/v1/product/productId/reject', () => {
  test('should return 200 when Reject a product with valid information', async () => {
    const response = await request(app)
      .put(baseURL + `/product/${productId}/reject`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        rejected_reasons: 'This is the rejected reason',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body?.responseData?.result?._id).toEqual(`${productId}`);
    expect(response.body?.responseData?.result?.status).toEqual('Reject');
    expect(response.body?.responseData?.result?.rejected_reasons).toEqual(
      'This is the rejected reason'
    );
  });

  test('should return 400 when the ID is in wrong format', async () => {
    const response = await request(app)
      .put(baseURL + `/product/1111111111111111/reject`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        rejected_reasons: 'This is the rejected reason',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'Wrong ID format, please try again'
    );
  });

  test('should return 400 when the ID is valid but can not find a matched product', async () => {
    const response = await request(app)
      .put(baseURL + `/product/111111111111111111111111/reject`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        rejected_reasons: 'No such product found',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain('No such product found');
  });

  test('should return 400 when the the rejected_reasons is missing', async () => {
    const response = await request(app)
      .put(baseURL + `/product/${productId}/reject`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'rejected_reasons is empty/null value'
    );
  });
});
// ======= END REJECT PRODUCT BY ID =======

// ======= START UPDATE PRODUCT VARIANT =======
describe('POST /rest/api/v1/product/update-variant-of-product', () => {
  test('should return 200 when updating price of a product with valid information', async () => {
    const response = await request(app)
      .post(baseURL + '/product/update-variant-of-product')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        productId: productId,
        newVariantId: newVariantId,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body?.responseData?.result?._id).toEqual(`${productId}`);
    expect(response.body?.responseData?.result?.varient_id).toEqual(
      `${newVariantId}`
    );
  });

  test('should return 400 when no matched product found (wrong product ID)', async () => {
    const response = await request(app)
      .post(baseURL + `/product/update-variant-of-product`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        productId: '111111111111111111111111',
        newVariantId: newVariantId,
      });
    console.log(response.body);
    expect(response.statusCode).toBe(400);
    expect(response.body?.status).toEqual('fail');
    expect(response.body?.message).toContain('No such product found');
  });

  test('should return 400 when no matched variant found (wrong variant ID)', async () => {
    const response = await request(app)
      .post(baseURL + `/product/update-variant-of-product`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        productId: productId,
        newVariantId: '111111111111111111111111',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body?.status).toEqual('fail');
    expect(response.body?.message).toContain('Failed to get matched variant');
  });

  test('should return 400 when product ID is not in Object ID format', async () => {
    const response = await request(app)
      .post(baseURL + `/product/update-variant-of-product`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        productId: '11111111111111111111111',
        newVariantId: newVariantId,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body?.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'Wrong ID format, please try again'
    );
  });

  test('should return 400 when product ID is not in Object ID format', async () => {
    const response = await request(app)
      .post(baseURL + `/product/update-variant-of-product`)
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        productId: productId,
        newVariantId: '11111111111111111111111',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body?.status).toEqual('fail');
    expect(response.body?.message).toContain(
      'Wrong ID format, please try again'
    );
  });
});
// ======= END UPDATE PRODUCT VARIANT =======
