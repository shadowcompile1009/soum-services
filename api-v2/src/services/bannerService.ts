import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { BannerFilterDto } from '../dto/banner/BannerFilterDto';
import { BannerPositionDto } from '../dto/banner/BannerPositionDto';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { BannerType } from '../enums/Banner';
import { BannerDocument, BannerInput } from '../models/Banner';
import { BannerRepository } from '../repositories/bannerRepository';
import { FeedService } from './feedService';
@Service()
export class BannerService {
  constructor(
    public bannerRepository: BannerRepository,
    public feedService: FeedService,
    public error: ErrorResponseDto
  ) {}

  async addBanner(bannerInput: BannerInput): Promise<string | BannerDocument> {
    try {
      const collectionDeeplinkRegex =
        /^soum:\/\/soum\.sa\/collection\/([a-fA-F0-9]{24})\/home$/;
      let collectionId = null;
      const match = bannerInput.bannerValue.match(collectionDeeplinkRegex);
      if (bannerInput.bannerType == BannerType.COLLECTION)
        collectionId = bannerInput.bannerValue;
      else if (
        match &&
        bannerInput.bannerType == BannerType.DEEP_LINK &&
        bannerInput.bannerValue.match(collectionDeeplinkRegex)
      ) {
        collectionId = match[1];
      }
      if (collectionId) {
        const result = await this.feedService.getFeedById(collectionId);
        if (result.collectionStatus !== 1 || result.totalActiveProducts === 0) {
          throw new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            Constants.MESSAGE.INVALID_COLLECTION_ID
          );
        }
      }

      const [err, data] = await this.bannerRepository.addBanner(bannerInput);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result as BannerDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        console.log(exception);
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_BANNER,
          exception.message
        );
      }
    }
  }
  async getBanners(filter: BannerFilterDto) {
    try {
      const [err, banners] = await this.bannerRepository.getBanners(filter);
      if (err) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_BANNERS;
        throw this.error;
      }
      return banners.result as BannerDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BANNERS,
          exception.message
        );
    }
  }
  async removeBanner(bannerId: string) {
    try {
      const [errBanner, banners] = await this.bannerRepository.getById(
        bannerId
      );
      if (errBanner) {
        this.error.errorCode = banners.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = banners.result.toString();
        this.error.message = banners.message;
        throw this.error;
      }
      return await this.bannerRepository.removeBanner(bannerId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_BANNER,
          exception.message
        );
      }
    }
  }
  async updateBannerPosition(positions: BannerPositionDto[]) {
    try {
      for (const iterator of positions) {
        const [errBanner, banners] = await this.bannerRepository.getById(
          iterator.id
        );
        if (errBanner) {
          this.error.errorCode = banners.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = banners.result.toString();
          this.error.message = banners.message;
          throw this.error;
        }
        const [err, data] = await this.bannerRepository.updateBannerPosition(
          iterator.id,
          iterator.position
        );
        if (err) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.result.toString();
          this.error.message = data.message;
          throw this.error;
        }
      }
      return {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: Constants.MESSAGE.BANNER_UPDATE_SUCCESS,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER_POSITION,
          exception.message
        );
      }
    }
  }

  async updateBanner(
    bannerId: string,
    bannerInput: BannerInput
  ): Promise<string | BannerDocument> {
    try {
      // Validate banner ID
      const [errBanner, banner] = await this.bannerRepository.getById(bannerId);
      const bannerDocument = banner.result as BannerDocument;
      if (errBanner) {
        this.error.errorCode = banner.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = banner.result.toString();
        this.error.message = banner.message;
        throw this.error;
      }

      const collectionDeeplinkRegex =
        /^soum:\/\/soum\.sa\/collection\/([a-fA-F0-9]{24})\/home$/;
      let collectionId = null;
      const match = bannerInput.bannerValue.match(collectionDeeplinkRegex);
      if (bannerInput.bannerType == BannerType.COLLECTION)
        collectionId = bannerInput.bannerValue;
      else if (
        match &&
        bannerInput.bannerType == BannerType.DEEP_LINK &&
        bannerInput.bannerValue.match(collectionDeeplinkRegex)
      ) {
        collectionId = match[1];
      }
      if (collectionId) {
        const result = await this.feedService.getFeedById(collectionId);
        if (result.collectionStatus !== 1 || result.totalActiveProducts === 0) {
          throw new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            Constants.MESSAGE.INVALID_COLLECTION_ID
          );
        }
      }
      // Prepare updated fields
      bannerDocument.banner_name = bannerInput.bannerName;
      bannerDocument.banner_type = bannerInput.bannerType;
      bannerDocument.banner_page = bannerInput.bannerPage;
      bannerDocument.banner_value = bannerInput.bannerValue;
      bannerDocument.banner_image =
        bannerInput.bannerImage || bannerDocument?.banner_image;
      bannerDocument.banner_position = bannerInput?.bannerPosition;
      bannerDocument.lang = bannerInput.lang;
      bannerDocument.type = bannerInput.type || bannerDocument.type;

      // Update the banner
      const [err, data] = await this.bannerRepository.updateBanner(
        bannerId,
        bannerDocument
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }

      return data.result as BannerDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER,
          exception.message
        );
      }
    }
  }
}
