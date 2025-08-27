import { BadRequestException, Injectable } from '@nestjs/common';
import { Addon, AddonDocument, AddonFilter } from './schemas/addon.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  AddonDto,
  AddonSummaryReqDto,
  AddonSummaryResDto,
  CreateAddonDto,
  UpdateAddonDto,
} from 'src/modules/addon/dto/addon.dto';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { PriceType } from './enum/priceType.enum';
import { AddonItem } from '../grpc/proto/addon.pb';
import { AddonStatus } from './enum/addonStatus.enum';
import { CommissionService } from '../commission/commission.service';
import {
  AddonSummaryCalculateData,
  CalculateAddonSummaryRequest,
} from '../grpc/proto/commission.pb';

@Injectable()
export class AddonService {
  constructor(
    @InjectModel(Addon.name)
    private readonly model: Model<AddonDocument>,
    private readonly commissionService: CommissionService,
  ) {}

  async findAll(
    { offset = 0, limit = 100 },
    addonFilter: AddonFilter,
  ): Promise<PaginatedDto<AddonItem>> {
    const query = { status: AddonStatus.ACTIVE };
    if (addonFilter.modelId) {
      query['modelIds'] = { $in: addonFilter.modelId };
    }
    if (addonFilter.addonIds) {
      query['_id'] = {
        $in: addonFilter.addonIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    const total = await this.model.countDocuments(query)
    const data = await this.model.find(query).skip(offset).limit(limit).exec();
    const updatedData = (data || []).map((item) => {
      const priceValue = (() => {
        let price = item.price;
        if (addonFilter.price) {
          if (item.priceType === PriceType.PERCENTAGE) {
            price = (item.price / 100) * addonFilter.price;
          }
        }
        return parseFloat(price.toFixed(2)) || 0;
      })();
      return {
        id: item.id,
        type: item.type,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        taglineEn: item?.taglineEn || [],
        taglineAr: item?.taglineAr || [],
        descriptionEn: item?.descriptionEn,
        descriptionAr: item?.descriptionAr,
        priceType: item?.priceType || null,
        validity: item?.validity || null,
        validityType: item?.validityType || null,
        image: item.image,
        status: item.status,
        sellerIds: item.sellerIds,
        price: priceValue,
        modelIds: item.modelIds
      } as AddonItem;
    });
    return {
      limit: limit,
      offset: offset,
      items: updatedData,
      total,
    } as PaginatedDto<AddonItem>;
  }

  async create(createAddonDto: AddonDto): Promise<CreateAddonDto> {
    try {
      const newAddonDto = {
        type: createAddonDto.type,
        nameEn: createAddonDto.nameEn,
        nameAr: createAddonDto.nameAr,
        taglineEn: createAddonDto?.taglineEn
          ? createAddonDto.taglineEn.split(',')
          : [],
        taglineAr: createAddonDto?.taglineAr
          ? createAddonDto.taglineAr.split(',')
          : [],
        descriptionEn: createAddonDto.descriptionEn,
        descriptionAr: createAddonDto.descriptionAr,
        priceType: createAddonDto.priceType,
        validity: createAddonDto.validity,
        validityType: createAddonDto.validityType,
        modelIds: JSON.parse(createAddonDto.modelIds.toString()),
        image: createAddonDto.image,
        price: Number(createAddonDto.price),
      } as CreateAddonDto;
      newAddonDto.sellerIds = (createAddonDto?.sellerIds?.split(',') || []).filter(id => id.trim() !== '') || [];
      newAddonDto.taglineAr = createAddonDto?.taglineAr?.split(',');
      newAddonDto.taglineEn = createAddonDto?.taglineEn?.split(',');
      const doc = await new this.model(newAddonDto).save();
      return { id: doc.toObject().id, ...newAddonDto } as CreateAddonDto;
    } catch (err) {
      throw new BadRequestException(err?.message || 'Failed to update addon');
    }
  }

  async summary(
    updateAddonDto: AddonSummaryReqDto,
  ): Promise<AddonSummaryResDto> {
    try {
      const { addOnIds, productPrice } = updateAddonDto;

      if (addOnIds?.length > 0) {
        const addonData = await this.getAddonData(addOnIds, productPrice);

        const addonSummary = await this.calculateAddonSummary(
          addonData,
          productPrice,
        );

        return {
          addOns: addonData,
          addOnsVat: addonSummary.addOnsVat,
          addOnsTotal: addonSummary.addOnsTotal,
          addOnsGrandTotal: addonSummary.addOnsGrandTotal,
        } as AddonSummaryResDto;
      }

      return this.getDefaultAddonSummary();
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Failed to get addon summary',
      );
    }
  }

  private async getAddonData(
    addOnIds: string[],
    productPrice: number | null,
  ): Promise<AddonItem[]> {
    const objectIdArray = addOnIds.map((id) => new mongoose.Types.ObjectId(id));

    const query = { _id: { $in: objectIdArray } };
    const data = await this.model.find(query).exec();

    return (data || []).map((item) => {
      const newPrice = this.calculateNewPrice(
        item.price,
        item.priceType,
        productPrice,
      );

      return {
        id: item.id,
        type: item.type,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        taglineEn: this.splitTagline(item.taglineEn),
        taglineAr: this.splitTagline(item.taglineAr),
        descriptionEn: item.descriptionEn,
        descriptionAr: item.descriptionAr,
        priceType: item.priceType || null,
        validity: item.validity || null,
        validityType: item.validityType || null,
        image: item.image,
        status: item.status,
        price: newPrice,
        sellerIds: this.splitTagline(item.sellerIds),
      } as AddonItem;
    });
  }

  private splitTagline(tagline: string | string[]): string[] | null {
    return Array.isArray(tagline)
      ? (tagline[0] as unknown as string)?.split(',')
      : (tagline as unknown as string)?.split(',') || null;
  }

  private calculateNewPrice(
    price: number,
    priceType: PriceType,
    productPrice: number | null,
  ): number {
    if (productPrice && priceType === PriceType.PERCENTAGE) {
      price = (price / 100) * productPrice;
    }
    return parseFloat(price.toFixed(2)) || 0;
  }

  private async calculateAddonSummary(
    addonData: AddonItem[],
    productPrice: number | null,
  ) {
    const addonSummaryCalcData = addonData.map(
      (item) =>
        ({
          priceType: item.priceType,
          addonPrice: item.price,
        }) as AddonSummaryCalculateData,
    );

    return this.commissionService.calculateAddonSummary({
      productPrice,
      addonSummaryCalculateData: addonSummaryCalcData,
    } as CalculateAddonSummaryRequest);
  }

  private getDefaultAddonSummary(): AddonSummaryResDto {
    return {
      addOns: [],
      addOnsVat: 0,
      addOnsTotal: 0,
      addOnsGrandTotal: 0,
    } as AddonSummaryResDto;
  }

  async update(id: string, updateAddonDto: UpdateAddonDto): Promise<void> {
    try {
      const updateFields: { [key: string]: any } = {};

      Object.keys(updateAddonDto).forEach((key) => {
        let value = updateAddonDto[key];

        if (value !== undefined && value !== null && value !== 'null') {
          if (key === 'taglineEn' || key === 'taglineAr') {
            if (value === '') {
              value = [];
            } else {
              value = (value as string).split(',');
            }
          }
          if (key === 'sellerIds') {
            if (value === '') {
              value = [];
            } else {
              value = (value as string).split(',');
            }
          }
          if(key === 'modelIds') {
             value = JSON.parse(value.toString());
          }
          updateFields[key] = value;
        }
      });

      await this.model.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $set: updateFields,
        },
      );
    } catch (err) {
      throw new BadRequestException(err?.message || 'Failed to update addon');
    }
  }

  async remove(id: string): Promise<void> {
    const _id = new mongoose.Types.ObjectId(id);
    await new this.model({ _id: _id }).deleteOne();
  }
}
