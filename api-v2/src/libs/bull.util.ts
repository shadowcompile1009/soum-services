import Bull from 'bull';
import Container, { Service } from 'typedi';
import { DMSecurityFeeService } from '../services/dmSecurityFeeService';

export enum JobTypes {
  CONFIRMATION = 'confirmation',
  NOT_SHIPPED = 'not-shipped',
  NOT_PICKED = 'not-picked',
  CONFIRMED_AVAILABILITY = 'confirmed-availability',
  IN_TRANSIT = 'in-transit',
  REFUND_TO_BUYER = 'refund-to-buyer',
  SELLER_DELETION_NUDGE = 'seller_detection_nudge',
  SELLER_ENGAGEMENT_MESSAGE = 'seller-Engagement_message',
  SELLER_UNRESPONSIVE_NUDGE = 'deletion_nudge_unresponsiveness_deactivation',
  CREATE_DM_ORDER = 'createDmOrder',
  VALIDATE_PROMO_CODE_USAGE = 'validatePromoCodeUsage',
  UPDATE_PRODUCT_SYNC_STATUS = 'updateProductSyncStatus',
  ITEM_DELIVERED = 'item_delivered',
  PRICE_NUDGE_MESSAGE = 'price_nudege_message',
  GENERATIVE_QA_TO_SELLER = 'generative_qa_to_seller',
  RESERVATION_ORDER_VERIFICATION = 'reservation_order_verification',
  SEND_PRODUCT_APPROVED_MESSAGE = 'send_product_approved_message',
  SEND_MESSAGE_ON_DM_STATUS_CHANGE = 'send_message_on_dm_status_change',
  EXPIRE_OFFER_FEED = 'expireFeeds',
  FBS_SELLER_AUTO_CONFIRM_AVAILABILITY = 'fbs_seller_auto_confirm_availability',
}

export enum InvoiceJobType {
  SELLER_INVOICE_TYPE = 'seller',
  BUYER_INVOICE_TYPE = 'buyer',
}
@Service()
export class InvoiceBullMQService {
  public dmSecurityFeeService: DMSecurityFeeService;
  public queue: any;
  private queueName = 'invoice-generation-jobs';

  constructor() {
    this.dmSecurityFeeService = Container.get(DMSecurityFeeService);
    this.queue = new Bull(this.queueName, process.env.REDIS_URL);
    this.queue.process(async (job: any, done: any) => {
      try {
        await this.dmSecurityFeeService.handleInvoiceBullJobs(
          job?.data?.id,
          job?.data?.type,
          job?.data?.requestType
        );
        done();
      } catch (err) {
        console.log(err);
      }
    });
  }

  getQueue() {
    return this.queue;
  }

  addJob(data: any, options: any) {
    return this.queue.add({ ...data }, options);
  }
}

@Service()
export class DailyReportBullMQService {
  public dmSecurityFeeService: DMSecurityFeeService;
  public queue: any;
  private queueName = 'daily-report-generation-jobs';

  constructor() {
    this.dmSecurityFeeService = Container.get(DMSecurityFeeService);
    this.queue = new Bull(this.queueName, process.env.REDIS_URL);
    this.queue.process(async (job: any, done: any) => {
      try {
        await this.dmSecurityFeeService.handleDailyReportBullJobs();
        done();
      } catch (err) {
        console.log(err);
      }
    });
  }

  getQueue() {
    return this.queue;
  }

  addJob(data: any, options: any) {
    return this.queue.add({ ...data }, options);
  }
}
