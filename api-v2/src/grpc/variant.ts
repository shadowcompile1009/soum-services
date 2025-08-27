import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Container } from 'typedi';

import { VariantService } from '../services/variantService';
import {
  GetMarketPriceByVariantIdRequest,
  GetMarketPriceByVariantIdResponse,
  GetVariantsRequest,
  GetVariantsResponse,
} from './proto/v2.pb';
import { VariantRepository } from '../repositories/variantRepository';
import { VariantDocument } from '../models/Variant';

const variantService = Container.get(VariantService);
const variantRepository = Container.get(VariantRepository);

export const GetMarketPriceByVariantId = async (
  call: ServerUnaryCall<
    GetMarketPriceByVariantIdRequest,
    GetMarketPriceByVariantIdResponse
  >,
  callback: sendUnaryData<GetMarketPriceByVariantIdResponse>
) => {
  try {
    let priceRange = null;
    const result = {
      minPrice: 0,
      maxPrice: 0,
    };
    let formatedGrade = 'good_condition';

    const { variantId, grade } = call.request;
    const [hasError, variantDocument] =
      await variantRepository.getByIdWithPriceNudge(variantId);
    if (hasError) {
      return callback(null, result);
    }

    const variant = await variantService.mapFromModelToGetVariantDto(
      variantDocument.result[0]
    );

    if (!variant || !variant.priceRanges) {
      return callback(null, result);
    }

    // TODO: We need to redifine the grades scheme with mobile. I don't know why it grades are defined in mobile side
    formatedGrade = grade?.toString()?.toLowerCase()?.trim()?.replace(' ', '_');

    if (formatedGrade === 'fair') {
      formatedGrade = 'good_condition';
    }
    if (formatedGrade === 'lightly_used') {
      formatedGrade = 'light_use';
    }

    for (const element of variant.priceRanges) {
      if (formatedGrade in element) {
        priceRange = element[formatedGrade];
        break;
      }
    }

    for (const element of priceRange) {
      if (element.label === 'Fair') {
        result.minPrice = element.from;
        result.maxPrice = element.to;
        break;
      }
    }

    callback(null, result);
  } catch (error) {
    console.log(error);
    callback(null, {
      minPrice: 0,
      maxPrice: 0,
    });
  }
};

// will be removed soon plz don't use it
export const GetVariants = async (
  call: ServerUnaryCall<GetVariantsRequest, GetVariantsResponse>,
  callback: sendUnaryData<GetVariantsResponse>
) => {
  try {
    const { categoryId } = call.request;
    const [err, variantsResult] =
      await variantRepository.getVariantViaCategoryId(categoryId);
    if (err)
      callback(null, {
        variants: [],
      });
    const result = (variantsResult.result as VariantDocument[]).map(elem => {
      return {
        id: elem._id.toString(),
        name: elem.varient,
        nameAr: elem.varient_ar,
      };
    });
    callback(null, { variants: result });
  } catch (error) {
    console.log(error);
    callback(null, {
      variants: [],
    });
  }
};
