import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { Payment, PaymentActionType, PaymentDocument } from '../models/Payment';
import { lookup, unwind } from '../util/queryHelper';
@Service()
export class PaymentRepository {
  async savePayment(
    paymentDocument: PaymentDocument
  ): Promise<
    [
      boolean,
      { code: number; result: PaymentDocument | string; message?: string }
    ]
  > {
    try {
      paymentDocument = new Payment(paymentDocument);
      const data = await paymentDocument.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_PAYMENT,
          message: exception.message,
        },
      ];
    }
  }

  async getById(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: PaymentDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Payment.findById(id).exec();
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_PAYMENT,
          },
        ];

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT,
          message: exception.message,
        },
      ];
    }
  }

  async getByOrderId(
    orderId: string
  ): Promise<
    [
      boolean,
      { code: number; result: PaymentDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Payment.findOne({
        'payment_input.order': orderId,
      }).exec();
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_PAYMENT,
          },
        ];

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT,
          message: exception.message,
        },
      ];
    }
  }

  async updatePayment(
    paymentDocument: PaymentDocument
  ): Promise<
    [
      boolean,
      { code: number; result: PaymentDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Payment.findByIdAndUpdate(
        paymentDocument._id,
        paymentDocument
      ).exec();
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_PAYMENT,
          },
        ];
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT,
          message: exception.message,
        },
      ];
    }
  }

  async getListingsTransaction(
    page: number,
    size: number,
    isGetSuccess: boolean
  ) {
    try {
      const aggregate: Array<Record<string, any>> = [];

      if (isGetSuccess) {
        aggregate.push({
          $match: {
            payment_action_type: PaymentActionType.ListingFees,
          },
        });
        aggregate.push(
          lookup('products', 'payment_input.product_id', '_id', 'product')
        );
        aggregate.push(unwind('$product', false));
        aggregate.push(
          lookup('varients', 'product.varient_id', '_id', 'varient')
        );
        aggregate.push(unwind('$varient', false));
        aggregate.push(
          lookup('device_models', 'product.model_id', '_id', 'model')
        );
        aggregate.push(unwind('$model', false));
        aggregate.push(unwind('$condition', true));
      } else {
        aggregate.push({
          $match: {
            payment_action_type: PaymentActionType.ListingFees,
            payment_status: { $ne: 'Completed' },
          },
        });
      }
      aggregate.push(
        {
          $project: {
            _id: 0,
            product_id: '$product._id',
            model: '$model.model_name',
            buy_now_price: '$product.sell_price',
            listing_date: '$product.createdDate',
            product_image: '$product.product_images',
            phone_number: '$payment_input.mobile_number',
            new_device_price: '$varient.current_price',
            paid_status: '$payment_status',
            payment_type: {
              $concat: ['$payment_provider', ' ', '$payment_provider_type'],
            },
            transaction_timestamp: '$created_date',
            hyperpay_split_reference_id: '$checkout_payment_response.id',
            product_grade: '$product.grade',
            condition: 1,
            price_nudge: '',
            fee_charged: '$payment_input.amount',
            updated_date: { $ifNull: ['$updated_date', '$created_date'] },
          },
        },
        {
          $sort: {
            transaction_timestamp: -1,
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'totalResult' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        }
      );
      const data: any = await Payment.aggregate(aggregate);

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_ON_HOLD_PRODUCTS,
          },
        ];
      }

      const currentGrading: string[] = [
        'like new',
        'lightly used',
        'fair',
        'extensive use',
      ];
      const conditionGrading: string[] = [
        'like_new',
        'light_use',
        'good_condition',
        'extensive_use',
      ];

      const returnedResult = {
        ...data[0]?.metadata[0],
        ...{ data: data[0].data },
      };

      if (isGetSuccess) {
        returnedResult.data.map((transaction: any) => {
          const index: number = currentGrading.indexOf(
            transaction.product_grade.toString().toLowerCase()
          );
          transaction.price_nudge = transaction.condition
            ? transaction.condition[conditionGrading[index]]
            : null;
          delete transaction.condition;
          delete transaction.product_grade;
        });
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_ON_HOLD_LISTINGS,
          message: exception.message,
        },
      ];
    }
  }
}
