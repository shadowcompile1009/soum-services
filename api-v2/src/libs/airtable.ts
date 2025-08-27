import Airtable from 'airtable';
import { DeltaMachineOrderDocument } from '../models/DeltaMachineOrder';
import { decryptMobilePhone } from '../util/authentication';
import { AddonType } from '../enums/AddonType';
import { AddOnSummary } from '../models/Brand';

interface IExpectedDeliveryTime {
  minDeliveryTime: string;
  maxDeliveryTime: string;
}

export class AirTable {
  private static base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_APP_ID);

  public static updateAirTableRecordStatusById(
    recordId: string,
    status: string,
    shippedAtSMSA: boolean,
    deliveredAtSMSA: boolean
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let objToUpdate = {};
      const date = new Date().toLocaleString('en', { timeZone: 'Asia/Riyadh' });
      if (shippedAtSMSA) {
        objToUpdate = {
          'DM Status': status,
          'Shipped at SMSA': date,
        };
      } else if (deliveredAtSMSA) {
        objToUpdate = {
          'DM Status': status,
          'Delivered at SMSA': date,
        };
      } else {
        objToUpdate = {
          'DM Status': status,
        };
      }
      AirTable.base(process.env.AIRTABLE_COLLECTION_NAME).update(
        recordId,
        objToUpdate,
        function (err, record) {
          if (err) {
            reject(err);
          }
          resolve(record);
        }
      );
    });
  }

  public static async createAirTableRecord(
    dmOrderDocument: DeltaMachineOrderDocument,
    expectedDeliveryTime: IExpectedDeliveryTime,
    addOnsSummary: AddOnSummary
  ): Promise<boolean> {
    let recordId: string = await this.getSellerId(
      dmOrderDocument.orderData.sellerPhone
    );
    if (!recordId) {
      recordId = await this.createSellerRecord(
        dmOrderDocument.orderData.sellerPhone
      );
    }
    return await this.sendAirTableCreateRecordCall(
      dmOrderDocument,
      recordId,
      expectedDeliveryTime,
      addOnsSummary
    );
  }

  public static async getAirTableRecordById(orderId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const record = await AirTable.base(process.env.AIRTABLE_COLLECTION_NAME)
          .select({
            filterByFormula: `{ID} = "${orderId}"`,
          })
          .all();
        if (record?.length) {
          resolve(record[0].id);
        } else {
          reject('no airtable record found');
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  private static async getSellerId(phoneNumber: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const record = await AirTable.base(
          process.env.AIRTABLE_SELLER_COLLECTION
        )
          .select({
            filterByFormula: `{Phone No} = "${phoneNumber}"`,
          })
          .all();
        if (record?.length) {
          resolve(record[0].id);
        } else {
          resolve('');
        }
      } catch (err) {
        reject('');
      }
    });
  }

  private static async createSellerRecord(
    phoneNumber: string
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        AirTable.base(process.env.AIRTABLE_SELLER_COLLECTION).create(
          {
            'Phone No': phoneNumber,
          },
          function (err, res) {
            if (err) {
              reject(err);
            }
            resolve(res?.id as string);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static async createAirTableDisputeRecord(
    orderNumber: string,
    disputeObj: any
  ): Promise<boolean> {
    let disputeReasons = '';
    let disputeImages = '';
    return new Promise(async (resolve, reject) => {
      try {
        for (const item of disputeObj['disputeData.disputeReason']) {
          disputeReasons += `${item.question?.ar}? ${item.answer?.ar}, `;
        }
        for (const item of disputeObj['disputeData.images']) {
          if (item.status) {
            disputeImages += `${item.imageUrl}, `;
          }
        }
        AirTable.base(process.env.AIRTABLE_DISPUTE_COLLECTION).create(
          {
            'SOUM ID': orderNumber,
            'Dispute Time': new Date().toDateString(),
            Description: disputeObj['disputeData.description'],
            'Phone Number': disputeObj['disputeData.preferredContactNumber'],
            'Dispute Reasons - أسباب الاعتراض': disputeReasons,
            'Attachments - مرفقات الاعتراض': disputeImages,
            Status: disputeObj?.status,
          },
          { typecast: true },
          function (err) {
            if (err) {
              reject(err);
            }
            resolve(true);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static async createAirTableRatingRecord(
    name: string,
    mobileNumber: string,
    notes: string,
    rating: string,
    timeSTamp: string
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        AirTable.base(process.env.AIRTABLE_RATING_COLLECTION).create(
          {
            Name: name,
            Notes: notes,
            Rating: rating.toString(),
            Timestamp: timeSTamp,
            'Mobile Number': decryptMobilePhone(mobileNumber),
          },
          { typecast: true },
          function (err) {
            console.log(err);
            if (err) {
              reject(err);
            }
            resolve(true);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  private static async sendAirTableCreateRecordCall(
    dmOrderDocument: DeltaMachineOrderDocument,
    recordId: string,
    expectedDeliveryTime: IExpectedDeliveryTime,
    addOnsSummary: AddOnSummary
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let questionsAndAnswersStr = '';
      if (dmOrderDocument.orderData?.questionsAndAnswers) {
        try {
          const questionsAndAnswers = JSON.parse(
            dmOrderDocument.orderData.questionsAndAnswers
          );
          questionsAndAnswersStr = questionsAndAnswers.reduce(
            (
              accumulator: string,
              currentValue: { question: string; answer: string }
            ) => {
              accumulator += `Q: ${currentValue.question}\nA: ${currentValue.answer}\n`;
              return accumulator;
            },
            ''
          );
        } catch (err) {}
      }
      try {
        const totalVatAmount =
          (
            (Number(dmOrderDocument?.orderData?.vatAmount) || 0) +
            (Number(dmOrderDocument?.orderData?.addOnsVat) || 0)
          ).toString() || null;

        const giftWrappingAddon = (addOnsSummary?.selectedAddOns || [])?.find(
          (addon: any) => addon.addOnType === AddonType.GIFT_WRAPPING
        );
        const extraPackagingAddon = (addOnsSummary?.selectedAddOns || [])?.find(
          (addon: any) => addon.addOnType === AddonType.EXTRA_PACKAGING
        );

        // prettier revert line back to this because of which have to disbale maxline rule
        // eslint-disable-next-line max-len
        const expectedTime = `${expectedDeliveryTime.minDeliveryTime}-${expectedDeliveryTime.maxDeliveryTime} business days`;

        AirTable.base(process.env.AIRTABLE_COLLECTION_NAME).create(
          {
            ID: dmOrderDocument.orderData.orderNumber,
            Date: dmOrderDocument?.orderData?.createdAt?.toString() || null,
            'Product ID': dmOrderDocument.orderData.productId,
            Status: dmOrderDocument.orderData.orderStatus,
            Brand: dmOrderDocument.orderData.brandName || '',
            'Listing Images':
              dmOrderDocument.orderData?.productImgs?.join(',\n') || '',
            'DM Status': dmOrderDocument.orderData.orderStatus,
            'Seller name': dmOrderDocument.orderData.sellerName,
            'Seller Phone': [recordId],
            'Seller City': dmOrderDocument.orderData.sellerCity,
            'Seller Address': dmOrderDocument.orderData.sellerAddress,
            'Failed Inspection Label':
              dmOrderDocument.orderData.failedInspectionLabel,
            'Buyer Address': dmOrderDocument.orderData.buyerAddress,
            'Buyer name': dmOrderDocument.orderData.buyerName,
            'Buyer Phone': dmOrderDocument.orderData.buyerPhone,
            'Buyer City': dmOrderDocument.orderData.buyerCity,
            'Buyer Neighbourhood': dmOrderDocument.orderData.buyerDistrict,
            AddOns: dmOrderDocument.orderData.addOns,
            'AddOns Total':
              dmOrderDocument?.orderData?.addOnsTotalAmount?.toString() || null,
            'AddOns GrandTotal':
              dmOrderDocument?.orderData?.addOnsGrandTotal != null
                ? dmOrderDocument.orderData.addOnsGrandTotal
                    .toFixed(2)
                    .toString()
                : null,
            'AddOns Vat':
              dmOrderDocument?.orderData?.addOnsVat?.toString() || null,
            'AddOns Warranty Validity':
              dmOrderDocument?.orderData?.addOnsValidity,
            'AddOns Warranty Description':
              dmOrderDocument?.orderData?.addOnsDescription,
            'Gift Wrapping': giftWrappingAddon ? 'Yes' : 'NO',
            'Gift Wrapping Price': giftWrappingAddon?.addOnPrice || '',
            'Extra Packaging': extraPackagingAddon ? 'Yes' : 'NO',
            'Extra Packaging Price': extraPackagingAddon?.addOnPrice || '',
            Product: dmOrderDocument.orderData.productName,
            Code: dmOrderDocument.orderData.buyerPromoCode,
            Category: dmOrderDocument.orderData.categoryName,
            'VAT Amount': totalVatAmount,
            'Commission Amount':
              dmOrderDocument?.orderData?.commissionAmount?.toString() || null,
            'Shipping Amount':
              dmOrderDocument?.orderData?.shippingAmount?.toString() || null,
            'Grand Total': dmOrderDocument.orderData.grandTotal,
            Price: dmOrderDocument.orderData.sellPrice,
            Payout:
              dmOrderDocument?.orderData?.payoutAmount?.toString() || null,
            'Tracking Number': dmOrderDocument.orderData.trackingNumber,
            'Last Mile Tracking Number':
              dmOrderDocument.orderData.lastMileTrackingNumber,
            'Seller Account Name': dmOrderDocument.orderData.sellerAcountName,
            'Seller Bank Name': dmOrderDocument.orderData.sellerBankName,
            'Seller IBAN': dmOrderDocument.orderData.sellerIBAN,
            'Seller Promos': dmOrderDocument.orderData.sellerPromoCode,
            'Payment Method': dmOrderDocument.orderData.paymentType,
            'Delivery Fee': dmOrderDocument.orderData.deliveryFee + '',
            'Variants AR': dmOrderDocument.orderData.productVarient,
            'Variants EN': dmOrderDocument.orderData.varient,
            'Question Answers AR': questionsAndAnswersStr,
            'Transaction type': dmOrderDocument.orderData.buyType,
            'Available Logistics Services':
              dmOrderDocument.orderData.availableLogisticsServices,
            'Price Quality Extra Commission': dmOrderDocument.orderData
              ?.price_quality_extra_commission
              ? dmOrderDocument.orderData?.price_quality_extra_commission?.toString() ||
                null
              : '',
            'Return/Warranty':
              dmOrderDocument?.orderData?.returnWarranty || '24 hours/ -',
            'Expected Time': expectedTime,
            'Product Description':
              dmOrderDocument?.orderData?.productDescription || '',
            'Inventory Info': dmOrderDocument?.orderData?.inventoryId || '',
          },
          { typecast: true },
          function (err) {
            if (err) {
              reject(err);
            }
            resolve(true);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  public static updateAirTableRecordPickupStatus(
    recordId: string,
    isDelivered: boolean
  ): Promise<any> {
    const date = new Date().toLocaleString('en', { timeZone: 'Asia/Riyadh' });
    return new Promise(async (resolve, reject) => {
      const objToUpdate = isDelivered
        ? { 'Delivered At B1': date }
        : { 'Pickedup At B1': date };
      AirTable.base(process.env.AIRTABLE_COLLECTION_NAME).update(
        recordId,
        objToUpdate,
        function (err, record) {
          if (err) {
            reject(err);
          }
          resolve(record);
        }
      );
    });
  }

  public static updateAirTableRecord(
    recordId: string,
    awbNo: string,
    trackingNumber: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const objToUpdate = {
        'Pickup Tracking': awbNo,
        'Tracking Number': trackingNumber,
      };
      AirTable.base(process.env.AIRTABLE_COLLECTION_NAME).update(
        recordId,
        objToUpdate,
        function (err, record) {
          if (err) {
            reject(err);
          }
          resolve(record);
        }
      );
    });
  }

  public static updatePostInspectionTrackingNumber(
    recordId: string,
    postInspectionTrackingNumber: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const objToUpdate = {
        'Post Inspection Tracking Number': postInspectionTrackingNumber,
      };
      AirTable.base(process.env.AIRTABLE_COLLECTION_NAME).update(
        recordId,
        objToUpdate,
        function (err, record) {
          if (err) {
            reject(err);
          }
          resolve(record);
        }
      );
    });
  }

  public static async updateAirTableRecordCommissionAmountById(
    recordId: string,
    commissionAmount: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const objToUpdate = {
        'Commission Amount': commissionAmount + '',
      };
      AirTable.base(process.env.AIRTABLE_COLLECTION_NAME).update(
        recordId,
        objToUpdate,
        function (err, record) {
          if (err) {
            reject(err);
          }
          resolve(record);
        }
      );
    });
  }
}
