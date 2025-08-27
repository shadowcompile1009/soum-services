import { Constants } from '../constants/constant';
import { Service } from 'typedi';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { HighlightRepository } from '../repositories/HighlightRepository';
import { ProductRepository } from '../repositories';
import { HighlightDocument } from '../models/Highlight';
import { ILegacyProductModel } from '../models/LegacyProducts';
import isEqual from 'lodash/isEqual';
import { ProductHighlights } from '../enums/ProductHighlights';

@Service()
export class HighlightService {
  constructor(
    public highlightRepository: HighlightRepository,
    public productRepository: ProductRepository,
    public error: ErrorResponseDto
  ) {}

  async generateHighlightForNewProducts() {
    try {
      const [errHighlight, highlightsData] =
        await this.highlightRepository.getAll();
      if (errHighlight || highlightsData.result.length <= 0) {
        this.error.errorCode = highlightsData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = highlightsData.result.toString();
        this.error.message = highlightsData.message;
        throw this.error;
      }

      const [errProducts, productsData] =
        await this.productRepository.getNewProducts();
      if (errProducts) {
        this.error.errorCode = productsData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = productsData.result.toString();
        this.error.message = productsData.message;
        throw this.error;
      }

      return Promise.all(
        (productsData.result as ILegacyProductModel[]).map((product: any) => {
          return new Promise(async (resolve, reject) => {
            try {
              const productHighlights = [];
              let highlightStatus: string =
                ProductHighlights.NoHighlightsAvailable;
              if (product?.response) {
                highlightStatus = ProductHighlights.Highlighted;
                for (const highlight of highlightsData.result as HighlightDocument[]) {
                  if (this.validHighlight(highlight, product)) {
                    productHighlights.push(highlight._id);
                  }
                }
              }

              const [errUpdate] =
                await this.productRepository.updateProductHighlights(
                  product._id,
                  productHighlights,
                  highlightStatus
                );
              if (errUpdate) {
                this.error.errorCode = productsData.code;
                this.error.errorType = Constants.ERROR_TYPE.API;
                throw this.error;
              }
              resolve(product._id);
            } catch (exception) {
              reject(exception);
            }
          });
        })
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }
  validHighlight(highlight: any, product: any) {
    try {
      const questionWithAnswers = product.response.responses.find(
        (elem: any) => elem.question_id == highlight.targetResponse.question_id
      );
      if (!highlight.targetCategory.equals(product.category_id)) {
        return false;
      } else if (
        !questionWithAnswers ||
        !isEqual(questionWithAnswers, highlight.targetResponse)
      ) {
        return false;
      } else {
        return true;
      }
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_FEED,
        exception.message
      );
    }
  }
}
