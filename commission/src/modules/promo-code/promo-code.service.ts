import mongoose, { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PromoCode, PromoCodeDocument } from './schemas';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { PromoCodeScopeDto, ReadPromoCodeDto, WritePromoCodeDto } from './dto';
import {
  PaymentProvider,
  PaymentProviderType,
  PromoCodeGenerationTaskStatus,
  PromoCodeScopeTypeEnum,
  PromoCodeStatus,
  PromoType,
  UserType,
} from './enum';
import { getErrorMessage } from './constants';
import { V2Service } from '../v2/v2.service';
import { PromoCodeGenerationTaskService } from './promo-code-generation-task.service';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectModel(PromoCode.name)
    private readonly model: Model<PromoCodeDocument>,
    private readonly v2Service: V2Service,
    @Inject(forwardRef(() => PromoCodeGenerationTaskService))
    private readonly promoCodeGenerationTaskService: PromoCodeGenerationTaskService,
  ) {}
  async listPromos({
    offset,
    limit,
    searchValue,
    parentPromoCodeId,
  }): Promise<PaginatedDto<ReadPromoCodeDto>> {
    let filter: Record<any, any> = {
      $or: [{ promoGenerator: 'Admin' }, { promoGenerator: null }],
    };
    if (searchValue) {
      filter = {
        ...filter,
        $or: [
          { code: { $regex: searchValue, $options: 'i' } },
          { bulkPrefix: searchValue },
        ],
      };
    }
    if (!searchValue) {
      filter = { ...filter, parentPromoCodeId: null };
    }
    if (parentPromoCodeId) {
      filter = { ...filter, parentPromoCodeId };
    }
    const data = await this.model
      .find(filter)
      .sort({ createdDate: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    const total = await this.model.countDocuments(filter);

    const response = await Promise.all(
      data.map(async (elem) => {
        let totalCodes = 1;
        if (!elem.code) {
          const task =
            await this.promoCodeGenerationTaskService.getByParentPromoCodeId(
              elem._id,
            );
          if (task) totalCodes = task.totalPromos;
        }

        return { ...elem.toJSON(), totalCodes } as ReadPromoCodeDto;
      }),
    );
    return {
      limit: limit,
      offset: offset,
      total: total,
      items: response,
    } as PaginatedDto<ReadPromoCodeDto>;
  }

  async getPromoCodeByFieldNameAndValue(
    fieldName: string,
    fieldValue: string,
  ): Promise<PromoCodeDocument> {
    return await this.model.findOne({ [fieldName]: fieldValue }).exec();
  }

  async getDefaultPromoCode(): Promise<PromoCodeDocument> {
    const now = new Date();
    return await this.model
      .findOne({
        isDefault: true,
        userType: UserType.BUYER,
        status: 'Active',
        $and: [{ toDate: { $gte: now } }, { fromDate: { $lte: now } }],
      })
      .exec();
  }

  async getFeedPromos(promoIds: string[]): Promise<PromoCodeDocument[]> {
    return await this.model.find({
      userType: UserType.BUYER,
      status: 'Active',
      $and: [
        { toDate: { $gte: new Date() } },
        { fromDate: { $lte: new Date() } },
      ],
      promoCodeScope: {
        $elemMatch: {
          promoCodeScopeType: PromoCodeScopeTypeEnum.FEEDS,
          ids: { $elemMatch: { $in: promoIds } },
        },
      },
    });
  }

  async getFeedPromo(promoId: string): Promise<PromoCodeDocument> {
    return await this.model.findOne({
      userType: UserType.BUYER,
      status: 'Active',
      $and: [
        { toDate: { $gte: new Date() } },
        { fromDate: { $lte: new Date() } },
      ],
      promoCodeScope: {
        $elemMatch: {
          promoCodeScopeType: PromoCodeScopeTypeEnum.FEEDS,
          ids: { $elemMatch: { $eq: promoId } },
        },
      },
    });
  }

  async getPromoCodeById(promoCodeId: string): Promise<PromoCodeDocument> {
    return await this.model.findById(promoCodeId).exec();
  }

  async getPromoCodesByIds(
    promoCodeIds: string[],
  ): Promise<PromoCodeDocument[]> {
    const idsToUse = promoCodeIds.filter((codeId) =>
      mongoose.isValidObjectId(codeId),
    );
    return await this.model.find({ _id: { $in: idsToUse } }).exec();
  }

  async getPromoCodesByCodes(
    promoCodes: string[],
  ): Promise<PromoCodeDocument[]> {
    return await this.model.find({ code: { $in: promoCodes } }).exec();
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode> {
    const promoCode = await this.model.findOne({ code }).exec();
    if (!promoCode) return null;
    return promoCode.toObject();
  }

  getDifferenceOfArrays(array1: string[], array2: string[]) {
    const set2 = new Set(array2);
    return array1.filter((element) => !set2.has(element));
  }
  async validatePromoCodeScope(
    promoCodeScope: PromoCodeScopeDto[],
    errorKey: string,
  ) {
    const scopes = ['feeds', 'models', 'brands', 'categories', 'sellers'];
    let grpcPayload = {
      feeds: [],
      models: [],
      brands: [],
      categories: [],
      sellers: [],
    };

    promoCodeScope.forEach((scope) => {
      grpcPayload = {
        ...grpcPayload,
        [scope.promoCodeScopeType]: scope.ids.filter((id) => id),
      };
    });

    const validatedScopes = await this.v2Service.validIdsForPromoCode(
      grpcPayload,
    );

    let error = {};
    scopes.forEach((scope) => {
      const difference = this.getDifferenceOfArrays(
        grpcPayload[scope],
        validatedScopes[scope],
      );
      if (difference.length > 0) {
        error = {
          ...error,
          [scope]: `${scope} id's ${difference.join(',')} are invalid.`,
        };
      }
    });
    if (Object.keys(error).length) {
      throw new BadRequestException({ [errorKey]: error });
    }
  }

  validatePromoCodeScopesHaveUniqueValues(dto: WritePromoCodeDto) {
    const promoCodeScope = dto.promoCodeScope;
    let exculedScopeMap = {};
    dto.excludedPromoCodeScope.forEach((scope) => {
      exculedScopeMap = {
        ...exculedScopeMap,
        [scope.promoCodeScopeType]: new Set(scope.ids),
      };
    });

    let error = {};
    promoCodeScope.forEach((scope) => {
      const scopeIds = scope.ids;
      const excludedScopeIds = exculedScopeMap[scope.promoCodeScopeType];
      if (excludedScopeIds) {
        const commonIds = scopeIds.filter((scopeId) =>
          excludedScopeIds.has(scopeId),
        );
        if (commonIds.length > 0) {
          error = {
            ...error,
            [scope.promoCodeScopeType]: `${
              scope.promoCodeScopeType
            } id's ${commonIds.join(
              ',',
            )} are present in both excluded and included list.`,
          };
        }
      }
    });

    if (Object.keys(error).length) {
      throw new BadRequestException(error);
    }
  }

  filterEmptyScopes(promoCodeScope: PromoCodeScopeDto[]) {
    return promoCodeScope.filter((scope) => scope.ids && scope.ids.length);
  }

  async validatePromoCodeCodeIsUnique(dto: WritePromoCodeDto) {
    if (dto.code) {
      const promoCode = await this.getPromoCodeByCode(dto.code);
      if (promoCode) {
        throw new BadRequestException(
          getErrorMessage('PROMO_CODE_ALREADY_EXISTS'),
        );
      }
    }
  }
  async validateOnlyOneDefaultPromo(dto: WritePromoCodeDto) {
    if (dto.isDefault) {
      const promoCode = await this.getDefaultPromoCode();
      if (promoCode) {
        throw new BadRequestException(
          getErrorMessage('DEFAULT_PROMO_ALREADY_EXISTS'),
        );
      }
    }
  }
  async validatePromoCodeDto(dto: WritePromoCodeDto) {
    if (dto.promoType === PromoType.FIXED) {
      if (dto.promoLimit < dto.discount) {
        throw new BadRequestException(
          getErrorMessage(
            'MINIMUM_SPEND_LIMIT_SHOULD_BE_GREATER_THAN_DISCOUNT',
          ),
        );
      }
    }

    this.validatePromoCodeScopesHaveUniqueValues(dto);

    dto.promoCodeScope = this.filterEmptyScopes(dto.promoCodeScope);
    dto.excludedPromoCodeScope = this.filterEmptyScopes(
      dto.excludedPromoCodeScope,
    );
    if (dto.promoCodeScope.length > 0) {
      await this.validatePromoCodeScope(dto.promoCodeScope, 'promoCodeScope');
    }
    if (dto.excludedPromoCodeScope.length > 0) {
      await this.validatePromoCodeScope(
        dto.promoCodeScope,
        'excludedPromoCodeScope',
      );
    }
  }

  async create(
    createPromoCodeDto: WritePromoCodeDto,
  ): Promise<PromoCodeDocument> {
    await this.validatePromoCodeDto(createPromoCodeDto);
    await this.validatePromoCodeCodeIsUnique(createPromoCodeDto);
    await this.validateOnlyOneDefaultPromo(createPromoCodeDto);
    const createdPromoCode = new this.model(createPromoCodeDto);
    return createdPromoCode.save();
  }

  async update(
    id: string,
    updatePromoCodeDto: WritePromoCodeDto,
  ): Promise<PromoCode> {
    const promoCode = await this.model.findById(id);
    if (!promoCode) {
      throw new NotFoundException(`PromoCode with ID "${id}" not found`);
    }
    await this.validatePromoCodeDto(updatePromoCodeDto);
    if (updatePromoCodeDto.code !== promoCode.code) {
      await this.validatePromoCodeCodeIsUnique(updatePromoCodeDto);
    }
    if (updatePromoCodeDto.isDefault !== promoCode.isDefault) {
      await this.validateOnlyOneDefaultPromo(updatePromoCodeDto);
    }

    const task =
      await this.promoCodeGenerationTaskService.getByParentPromoCodeId(id);
    if (!task) {
      return await this.model
        .findByIdAndUpdate(id, updatePromoCodeDto, { new: true })
        .exec();
    }
    if (task.taskStatus !== PromoCodeGenerationTaskStatus.COMPLETED) {
      throw new NotFoundException(
        `Bulk generation of promo codes are not complete against id ${id}`,
      );
    }

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updatePromoCodeDto).filter(
        ([key]) => key !== 'code' && key !== 'bulkPrefix',
      ),
    );
    await this.model.updateMany(
      {
        $or: [{ _id: id }, { parentPromoCodeId: id }],
      },
      { $set: fieldsToUpdate },
    );
    return await this.model.findById(id);
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.model
      .deleteMany({
        $or: [{ _id: id }, { parentPromoCodeId: id }],
      })
      .exec();
    if (!result) {
      throw new NotFoundException(`PromoCode with ID "${id}" not found`);
    }
    return { message: 'PromoCode deleted successfully' };
  }

  async updateUsageCount(
    promoCodeId: string,
    count: number,
  ): Promise<PromoCode> {
    const promoCode = await this.model.findByIdAndUpdate(
      promoCodeId,
      { $inc: { totalUsage: count } },
      { new: true },
    );

    if (!promoCode) {
      throw new NotFoundException(
        `PromoCode with ID "${promoCodeId}" not found`,
      );
    }

    return promoCode;
  }

  async validatePromoCodeOnProduct(
    productId: string,
    promoCode: PromoCode,
    language: string,
  ) {
    const productDetails =
      await this.v2Service.getProductDetailsForPromoCodeValidation({
        productId,
      });
    if (
      promoCode.promoLimit !== null &&
      promoCode.promoLimit !== undefined &&
      productDetails.sellPrice < promoCode.promoLimit
    ) {
      throw new BadRequestException(
        getErrorMessage('PROMO_CODE_NOT_APPLICABLE_TO_PRODUCT', language),
      );
    }
    const { detailsForScopeValidation } = productDetails;

    promoCode.promoCodeScope.forEach((promoCodeScope) => {
      const productIds =
        detailsForScopeValidation[promoCodeScope.promoCodeScopeType] || [];
      let raiseException = true;
      promoCodeScope.ids.forEach((scopeId) => {
        if (productIds.find((productId) => productId === scopeId)) {
          raiseException = false;
        }
      });
      if (raiseException) {
        throw new BadRequestException(
          getErrorMessage('PROMO_CODE_NOT_APPLICABLE_TO_PRODUCT', language),
        );
      }
    });

    promoCode.excludedPromoCodeScope.forEach((promoCodeScope) => {
      const productIds =
        detailsForScopeValidation[promoCodeScope.promoCodeScopeType] || [];
      promoCodeScope.ids.forEach((scopeId) => {
        if (productIds.find((productId) => productId === scopeId)) {
          throw new BadRequestException(
            getErrorMessage('PROMO_CODE_NOT_APPLICABLE_TO_PRODUCT', language),
          );
        }
      });
    });
  }

  async validatePromoCodeUsage(
    code: string,
    productId: string,
    paymentProvider: PaymentProvider,
    paymentProviderType: PaymentProviderType,
    language: string,
    userId: string,
  ) {
    const promoCode = await this.getPromoCodeByCode(code);
    if (!promoCode || promoCode.status !== PromoCodeStatus.ACTIVE) {
      throw new BadRequestException(
        getErrorMessage('PROMO_CODE_NOT_FOUND', language),
      );
    }

    const currentTime = new Date().getTime();
    const promoExpiryTime = new Date(promoCode.toDate);
    promoExpiryTime.setHours(23, 59, 59, 999);
    if (
      promoCode.fromDate &&
      promoCode.toDate &&
      (currentTime < promoCode.fromDate.getTime() ||
        currentTime > promoExpiryTime.getTime())
    ) {
      throw new BadRequestException(
        getErrorMessage('PROMO_CODE_NO_LONGER_VALID', language),
      );
    }
    if (
      promoCode.totalAllowedUsage !== null &&
      promoCode.totalAllowedUsage !== undefined &&
      promoCode.totalUsage >= promoCode.totalAllowedUsage
    ) {
      throw new BadRequestException(
        getErrorMessage('PROMO_CODE_NO_LONGER_VALID', language),
      );
    }

    if (promoCode.availablePayment) {
      const paymentMethodValidation = promoCode.availablePayment.find(
        (paymentType) =>
          paymentType.paymentProviderType === paymentProviderType,
      );

      if (!paymentMethodValidation) {
        throw new BadRequestException(
          getErrorMessage(
            'PROMO_CODE_NOT_APPLICABLE_TO_PAYMENT_METHOD',
            language,
          ),
        );
      }
    }

    const userUsage = await this.v2Service.validateUserUsageOfPromoCode({
      promoCodeId: promoCode.id,
      userId,
    });
    if (userUsage.isUsed && !promoCode.isDefault) {
      throw new BadRequestException(
        getErrorMessage('PROMO_CODE_USED_BEFORE', language),
      );
    }
    await this.validatePromoCodeOnProduct(productId, promoCode, language);
    return { promoCode };
  }
}
