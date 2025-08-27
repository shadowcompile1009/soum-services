import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { V2Service } from '../v2/v2.service';
import { Offer, OfferDocument } from './schema/offer.schema';
import { CreateBidDto } from '../bid/dto/create-bid.dto';
import { BidStatus } from '../status/enums/status.enum';
import { BreakDownResponse } from '../grpc/proto/v2.pb';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { sendEventData } from '@src/utils/webEngageEvents';
import { UserOffer } from './dto/userOfferDto';
import { UpdateOffer } from './dto/updateOfferDto';
import { GetOfferForProductRequest, OfferResponse } from '../grpc/proto/bid.pb';
import { getCache, setCache } from '@src/utils/redis';

@Injectable()
export class OfferService {
  constructor(
    @InjectModel(Offer.name)
    private readonly model: Model<OfferDocument>,
    private readonly v2Service: V2Service,
  ) {}

  async cacheUserOffersCount(userId: string) {
    const key = `user_${userId}_offers_count`;
    const count = await this.model.count({ userId }).exec();
    await setCache(key, count);
    return count;
  }
  async create(createOfferDto: CreateBidDto) {
    const productsRes = await this.v2Service.getProductStatuses({
      productId: createOfferDto.productId,
    });
    const user = await this.v2Service.getUser({ id: createOfferDto.userId });
    if (productsRes?.expired || productsRes?.sold || productsRes?.deleted) {
      throw new BadRequestException('The product is expired/sold/deleted.');
    }

    const buyerGetBidSummaryForOne = await this.v2Service.getBidSummaryForOne({
      productId: createOfferDto.productId,
      bidPrice: createOfferDto.amount,
      allPayments: false,
      paymentOptionId: createOfferDto.paymentOptionId,
      userId: createOfferDto.userId,
    });
    if (!buyerGetBidSummaryForOne?.commissionSummary) {
      throw new BadRequestException('No commissions was found.');
    }
    const commissionSummaryBreakDownForBuyer =
      buyerGetBidSummaryForOne?.commissionSummary.withPromo ||
      buyerGetBidSummaryForOne?.commissionSummary.withoutPromo;

    const sellerGetBidSummaryForOne = await this.v2Service.getBidSummaryForOne({
      productId: createOfferDto.productId,
      bidPrice: createOfferDto.amount,
      allPayments: false,
      paymentOptionId: createOfferDto.paymentOptionId,
      userId: buyerGetBidSummaryForOne.product.sellerId,
    });
    if (!sellerGetBidSummaryForOne?.commissionSummary) {
      throw new BadRequestException('No commissions was found');
    }
    const commissionSummaryBreakDownForSeller =
      sellerGetBidSummaryForOne?.commissionSummary.withPromo ||
      sellerGetBidSummaryForOne?.commissionSummary.withoutPromo;
    const newOffer = await this.model.create({
      productId: createOfferDto.productId,
      userId: createOfferDto.userId,
      userName: user.name,
      sellPrice: createOfferDto.amount,
      status: BidStatus.OPEN,
      buyerOfferSummary: {
        commission: commissionSummaryBreakDownForBuyer.commission,
        commissionVat: commissionSummaryBreakDownForBuyer.commissionVat,
        grandTotal: commissionSummaryBreakDownForBuyer.grandTotal,
      },
      sellerOfferSummary: {
        commission: commissionSummaryBreakDownForSeller.commission,
        commissionVat: commissionSummaryBreakDownForSeller.commissionVat,
        grandTotal: commissionSummaryBreakDownForSeller.grandTotal,
      },
    });
    await this.cacheUserOffersCount(createOfferDto.userId);
    return newOffer;
  }

  async calculate({ productId, amount, userId = '' }) {
    const { commissionSummary } = await this.v2Service.getBidSummaryForOne({
      productId,
      bidPrice: amount,
      userId,
      allPayments: false,
      paymentOptionId: null,
    });

    if (!commissionSummary) {
      throw new BadRequestException('No commissions was found');
    }

    return {
      commissionSummaries: this.mapCommissionSummary(commissionSummary),
    };
  }

  async getOffersForSellerOrBuyer({
    offset,
    limit,
    productId,
    userId,
  }): Promise<PaginatedDto<UserOffer>> {
    const { products } = await this.v2Service.getProducts({
      productIds: [productId],
    });
    if (!products?.length)
      throw new BadRequestException('product was not found');

    const isSeller = products[0].sellerId === userId;

    const matchCondition: any = isSeller
      ? { productId }
      : { productId, userId };

    const offers = await this.model
      .find(matchCondition)
      .sort({
        createdAt: -1,
      })
      .limit(Number(offset) + Number(limit))
      .skip(Number(offset));

    const count = await this.model.count(matchCondition).exec();

    return {
      items: offers.map((elem) => {
        return {
          id: elem.toObject().id,
          productId: elem.productId,
          userId: elem.userId,
          sellPrice: elem.sellPrice,
          status: elem.status,
          userName: elem.userName,
          message: elem.message,
          offerSummary: isSeller
            ? elem.sellerOfferSummary
            : elem.buyerOfferSummary,
          createdAt: elem.createdAt,
          updatedAt: elem.updatedAt,
        } as UserOffer;
      }),
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  async getCurrentUserOffersCount(userId: string) {
    const key = `user_${userId}_offers_count`;
    const cacheResult = await getCache(key);
    if (cacheResult !== null && cacheResult !== undefined) {
      return cacheResult;
    }
    return await this.cacheUserOffersCount(userId);
  }

  async getCurrentUserOffers({
    offset,
    limit,
    userId,
  }): Promise<PaginatedDto<UserOffer>> {
    const offers = await this.model
      .find({ userId })
      .sort({
        createdAt: -1,
      })
      .limit(Number(offset) + Number(limit))
      .skip(Number(offset));

    const count = await this.model.count({ userId }).exec();

    const productIds = offers.map((elem) => elem.productId);
    const getProductsRes = await this.v2Service.getProducts({
      productIds: [...productIds],
      getAttributes: true,
    });

    return {
      items: offers.map((elem) => {
        let messageAddedTime;
        const hasMessage = !!elem.message;
        if (hasMessage && elem.messageAddedTime) {
          messageAddedTime = elem.messageAddedTime;
        } else if (hasMessage && !elem.messageAddedTime) {
          messageAddedTime = elem.updatedAt;
        }
        return {
          id: elem.toObject().id,
          productId: elem.productId,
          userId: elem.userId,
          sellPrice: elem.sellPrice,
          status: elem.status,
          userName: elem.userName,
          message: elem.message,
          offerSummary: elem.buyerOfferSummary,
          createdAt: elem.createdAt,
          updatedAt: elem.updatedAt,
          messageAddedTime: messageAddedTime,
          productDetail: getProductsRes.products.find(
            (product) => product.productId === elem.productId,
          ),
        };
      }),
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  async acceptOrReject(updateOffer: UpdateOffer) {
    let offer = await this.model.findById(updateOffer.id).exec();
    if (!offer) {
      throw new BadRequestException('incorrect offer Id');
    }
    const productsRes = await this.v2Service.getProductStatuses({
      productId: offer.productId,
    });
    if (productsRes?.expired || productsRes?.sold || productsRes?.deleted) {
      throw new BadRequestException('The product is expired/sold/deleted');
    }
    let messageAddedTime;
    if (updateOffer.message && !offer.message) {
      messageAddedTime = new Date();
    }
    try {
      // update status offer to accepted
      offer = await this.model.findByIdAndUpdate(updateOffer.id, [
        {
          $set: {
            status: updateOffer.status || offer.status,
            message: updateOffer.message || offer.message,
            updatedAt: new Date(),
            messageAddedTime: messageAddedTime,
          },
        },
      ]);
      // Send webengage event
      const webEngageData = {
        'Offer Amount': offer.sellPrice,
        'Product Id': offer.productId,
      };
      const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
      await sendEventData(
        offer.userId,
        'Buyer - Offer Accepted',
        dateFormat,
        webEngageData,
      );
      return offer;
    } catch (error) {
      throw new BadRequestException('Fail to change status.');
    }
  }

  async getOfferForUserInProduct(
    getOfferForProductRequest: GetOfferForProductRequest,
  ) {
    const offer = await this.model.findOne({
      userId: getOfferForProductRequest.userId,
      productId: getOfferForProductRequest.productId,
      status: BidStatus.ACCEPTED,
    });
    if (!offer)
      return {
        id: null,
        status: null,
      };

    return {
      status: offer.status,
      sellPrice: offer.sellPrice,
      buyerOfferSummary: offer.buyerOfferSummary,
    } as OfferResponse;
  }

  mapCommissionSummary(commissionSummary: BreakDownResponse) {
    const { withPromo, withoutPromo } = commissionSummary;
    const productPriceSummary = {
      sellPrice: withoutPromo.sellPrice,
      commission: withoutPromo.commission,
      vat: withoutPromo.totalVat,
      shipping: withoutPromo.deliveryFee,
      grandTotal: withoutPromo.grandTotal,
      commissionAnalysis: withoutPromo.commissionAnalysis || {},
    };
    const productPriceDiscountSummary = withPromo
      ? {
          sellPrice: withPromo?.sellPrice,
          commission: withPromo?.commission,
          vat:
            Number(withPromo?.commissionVat) + Number(withPromo.deliveryFeeVat),
          shipping: withPromo?.deliveryFee,
          grandTotal: withPromo?.grandTotal,
          discountValue: withPromo.discount,
          totalDiscount:
            Number(withoutPromo.grandTotal) - Number(withPromo.grandTotal),
          commissionAnalysis: withPromo.commissionAnalysis || {},
        }
      : null;

    return {
      productPriceSummary,
      productPriceDiscountSummary,
    };
  }
}
