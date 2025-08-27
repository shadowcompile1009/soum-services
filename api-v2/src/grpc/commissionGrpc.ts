import mongoose from 'mongoose';
import { Container } from 'typedi';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';

import {
  GetProductDetailsForPromoCodeValidationRequest,
  GetProductDetailsForPromoCodeValidationResponse,
  ValidateUserUsageOfPromoCodeRequest,
  ValidateUserUsageOfPromoCodeResponse,
  ValidIDsForPromoCodeRequest,
  ValidIDsForPromoCodeResponse,
} from './proto/v2.pb';
import {
  ModelRepository,
  UserRepository,
  FeedRepository,
  CategoryRepository,
  BrandRepository,
  OrderRepository,
} from '../repositories';
import { ProductService } from '../services/productService';

const userRepository = Container.get(UserRepository);
const feedRepository = Container.get(FeedRepository);
const modelRepository = Container.get(ModelRepository);
const brandRepository = Container.get(BrandRepository);
const categoryRepository = Container.get(CategoryRepository);
const productService = Container.get(ProductService);
const orderRepository = Container.get(OrderRepository);

export const ValidIdsForPromoCode = async (
  call: ServerUnaryCall<
    ValidIDsForPromoCodeRequest,
    ValidIDsForPromoCodeResponse
  >,
  callback: sendUnaryData<ValidIDsForPromoCodeResponse>
) => {
  try {
    const request = call.request;
    const [users, models, feeds, categories, brands] = await Promise.all([
      userRepository.getUsersByIds(request.sellers || []),
      modelRepository.getDeviceModelByIds(request.models || []),
      feedRepository.getByIds(request.feeds || []),
      categoryRepository.getByIds(request.categories || []),
      brandRepository.getByIds(request.brands || []),
    ]);

    const response = {
      sellers: users.map(obj => obj._id),
      feeds: feeds.map(obj => obj._id),
      models: models.map(obj => obj._id),
      brands: brands.map(obj => obj._id),
      categories: categories.map(obj => obj._id),
    };
    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const GetProductDetailsForPromoCodeValidation = async (
  call: ServerUnaryCall<
    GetProductDetailsForPromoCodeValidationRequest,
    GetProductDetailsForPromoCodeValidationResponse
  >,
  callback: sendUnaryData<GetProductDetailsForPromoCodeValidationResponse>
) => {
  try {
    const request = call.request;
    const productId = request.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error(`ProductId ${productId} is not valid`);
    }
    const response = await productService.getProductDetailsForPromoValidation(
      productId
    );

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const ValidateUserUsageOfPromoCode = async (
  call: ServerUnaryCall<
    ValidateUserUsageOfPromoCodeRequest,
    ValidateUserUsageOfPromoCodeResponse
  >,
  callback: sendUnaryData<ValidateUserUsageOfPromoCodeResponse>
) => {
  try {
    const request = call.request;
    const userId = request.userId;
    const promoCodeId = request.promoCodeId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`UserId ${userId} is not valid`);
    }
    const response = await orderRepository.getUserOrderWithPromo(
      promoCodeId,
      userId
    );

    callback(null, { isUsed: !!response });
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};
