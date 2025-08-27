import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CancellationFeeSettingsService } from '../cancellation-fee-settings/cancellation-fee-settings.service';
import { PenaltyService } from '../penalty/penalty.service';
import { PenaltyDocument } from '../penalty/schemas/penalty.schema';
import { V2Service } from '../v2/v2.service';
import {
  CreateInvoiceRequest,
  DM_BACKEND_SERVICE_NAME,
  GetCancellationFeeRequest,
  GetCancellationFeeResponse,
  GetHoldingPenaltyBalanceRequest,
  GetHoldingPenaltyBalanceResponse,
  GetPenalizedOrdersMerchantRequest,
  GetPenalizedOrdersMerchantResponse,
  GetPenalizedOrdersMerchantResponse_PenalizedOrders,
  GetStandingPenaltyToDmoRequest,
  GetStandingPenaltyToDmoResponse,
  UpdateHoldingPenaltyRequest,
  UpdateHoldingPenaltyResponse,
} from './proto/dmbackend.pb';
import { GetPenalizedOrdersResponse_PenalizedOrders } from './proto/v2.pb';
import { OrdersService } from '../orders/orders.service';

@Controller('grpc')
export class GrpcController {
  private readonly logger = new Logger(PenaltyService.name);
  constructor(
    private readonly penaltyService: PenaltyService,
    private readonly orderService: OrdersService,
    private readonly cancellationFeeService: CancellationFeeSettingsService,
    private readonly v2Service: V2Service,
  ) {}

  @GrpcMethod(DM_BACKEND_SERVICE_NAME, 'GetHoldingPenaltyBalance')
  async getHoldingPenaltyBalance(
    payload: GetHoldingPenaltyBalanceRequest,
  ): Promise<GetHoldingPenaltyBalanceResponse> {
    try {
      const penaltyBalance = await this.penaltyService.getHoldingPenaltyBalance(
        payload?.sellerId,
        payload?.range,
      );
      return {
        amount: penaltyBalance?.amount,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        amount: 0,
      };
    }
  }

  @GrpcMethod(DM_BACKEND_SERVICE_NAME, 'GetStandingPenaltyToDmo')
  async getStandingPenaltyToDmo(
    payload: GetStandingPenaltyToDmoRequest,
  ): Promise<GetStandingPenaltyToDmoResponse> {
    try {
      const penaltyBalance = await this.penaltyService.getPenaltyPerDMO(
        payload?.dmoId,
      );
      return {
        dmoId: penaltyBalance?.dmoId,
        penalty: penaltyBalance?.amount,
        userId: penaltyBalance?.userId,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        dmoId: payload?.dmoId,
        penalty: 0,
        userId: '',
      };
    }
  }

  @GrpcMethod(DM_BACKEND_SERVICE_NAME, 'UpdateHoldingPenalty')
  async updateHoldingPenalty(
    payload: UpdateHoldingPenaltyRequest,
  ): Promise<UpdateHoldingPenaltyResponse> {
    try {
      if (!payload?.isPayout) {
        await this.penaltyService.deductHoldingPenaltyBalance(
          payload?.sellerId,
          payload?.dmoId,
        );
      } else {
        await this.penaltyService.updatePaidStatusHoldingPenaltyBalance(
          payload?.sellerId,
        );
      }
      return {};
    } catch (error) {
      this.logger.error(error);
      return {};
    }
  }
  @GrpcMethod(DM_BACKEND_SERVICE_NAME, 'GetCancellationFee')
  async getCancellationFee(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload: GetCancellationFeeRequest,
  ): Promise<GetCancellationFeeResponse> {
    try {
      const penaltyBalance =
        await this.cancellationFeeService.getCancellationFeeSettings();
      return {
        cancelFee: penaltyBalance?.config || 0,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        cancelFee: 0,
      };
    }
  }
  @GrpcMethod(DM_BACKEND_SERVICE_NAME, 'GetPenalizedOrdersMerchant')
  async getPenalizedOrdersMerchant(
    payload: GetPenalizedOrdersMerchantRequest,
  ): Promise<GetPenalizedOrdersMerchantResponse> {
    try {
      const { merchantId, page, size, range } = payload;
      const penalties = await this.penaltyService.getPenalizedOrderList(
        merchantId,
        range,
      );
      if (!penalties) {
        return {
          orders: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: size,
        };
      }
      const dmoIds = penalties?.map((penalty) => penalty?.dmoId);

      const penaltiesMap = new Map<string, PenaltyDocument>();
      penalties.forEach((penalty) => {
        penaltiesMap.set(penalty.dmoId, penalty);
      });

      const data = await this.v2Service.getPenalizedOrders({
        dmoIds,
        page,
        size,
        range,
      });

      const ordersMap = new Map<
        string,
        GetPenalizedOrdersResponse_PenalizedOrders
      >();
      const orders = data?.orders;
      orders.forEach((order) => {
        ordersMap.set(order.dmoId, order);
      });

      const mappingPenalties: GetPenalizedOrdersMerchantResponse_PenalizedOrders[] =
        [];
      await Promise.all(
        penalties.map(async (penalty: PenaltyDocument) => {
          try {
            if (ordersMap.has(penalty.dmoId)) {
              const penaltyFee = penaltiesMap.get(penalty.dmoId).amount;
              const payoutAmount = ordersMap.get(penalty.dmoId).payoutAmount;
              const mappingPenalty: GetPenalizedOrdersMerchantResponse_PenalizedOrders =
                {
                  productName: ordersMap.get(penalty.dmoId).productName,
                  orderNumber: ordersMap.get(penalty.dmoId).orderNumber,
                  payoutAmount: payoutAmount,
                  penalty: penaltyFee,
                  finalPayout: payoutAmount - penaltyFee,
                  nctReason: ordersMap.get(penalty.dmoId).nctReason,
                  nctReasonAR: ordersMap.get(penalty.dmoId).nctReasonAR,
                };
              mappingPenalties.push(mappingPenalty);
            }
          } catch (error) {
            console.log(`Get penalty per order fails: ${error}`);
          }
        }),
      );

      return {
        ...data,
        orders: mappingPenalties,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        orders: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0,
      };
    }
  }

  @GrpcMethod(DM_BACKEND_SERVICE_NAME, 'CreateInvoice')
  async createInvoice(payload: CreateInvoiceRequest) {
    try {
      await this.orderService.createInvoice(payload);
    } catch (error) {}
  }
}
