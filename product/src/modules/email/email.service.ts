import { Inject, Injectable } from '@nestjs/common';
import { SendGridClient } from './sendgrid-client';
import { V2Service } from '../v2/v2.service';
import { MESSAGE } from './constants/message';
import { GetViewedProductsResponse } from '../grpc/proto/v2.pb';
import emailConfig from '@src/config/email.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConfigData: ConfigType<typeof emailConfig>,
    private readonly sendGridClient: SendGridClient,
    private readonly v2Service: V2Service,
  ) {}

  async sendEmailFinance(
    files: Express.Multer.File[],
    payload: any,
    user_id: string,
  ): Promise<{ code: number; message?: any }> {

    console.log('sendEmailFinance starting>>>');

    const sendTo = this.emailConfigData.SENDGRID_TO.split(',');

    console.log('sendTo starting>>>', sendTo);

    // const ccTo = (
    //   isProduction ? process.env.SENDGRID_CC_PROD : process.env.SENDGRID_CC_DEV
    // ).split(',');

    const ccTo = this.emailConfigData.SENDGRID_CC.split(',');

    console.log('ccTo starting>>>', ccTo);

    const user = await this.v2Service.getUser({
      id: user_id,
    });

    if (!user) {
      return { code: 400, message: MESSAGE.USER_NOT_FOUND };
    }

    const { fileNames, fileContents } = this.extractFileData(files || []);

    let productId: string | null = null;
    let isFinancingEmailSent: boolean = false;
    if (payload.orderId && !payload.productId) {
      try {
        const orderDetail = await this.v2Service.getOrderDetail({
          orderId: payload.orderId,
        });
        isFinancingEmailSent = orderDetail.isFinancingEmailSent;
        productId = orderDetail.productId;
      } catch {
        return { code: 400, message: MESSAGE.ORDER_NOT_FOUND };
      }
    } else {
      productId = payload.productId;
    }

    if (isFinancingEmailSent) {
      return { code: 400, message: MESSAGE.EMAIL_ALREADY_SENT };
    }

    let productDetail: GetViewedProductsResponse | null = null;
    try {
      productDetail = await this.v2Service.getViewedProducts({
        productIds: [productId],
        shouldSkipExpire: true,
      });
    } catch {
      return { code: 400, message: MESSAGE.PRODUCT_NOT_FOUND };
    }

    console.log('productDetail starting>>>');

    const { brand, attributes, sellPrice } = productDetail.products[0];
    console.log('attributes are>>>', attributes);

    const yearAttribute = this.findAttribute(attributes, 'Year');
    console.log('yearAttribute is>>>', yearAttribute);

    const modelAttribute = this.findAttribute(attributes, 'Car Model');

    console.log('modelAttribute is>>>', modelAttribute);

    const reversedSubject = `\u200Fطلب تمويل: ${payload.fullName}`;

    const emailOptions: any = {
      to: sendTo,
      cc: ccTo,
      subject: reversedSubject,
      html: `<div dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
                <p>السادة الكرام،</p>
                <p>تحية طيبة وبعد،</p>
                <p>
                    نود إفادتكم بأن العميل الموضح تفاصيله أدناه قد تقدم بطلب تمويل لشراء السيارة،
                    ونرفق لكم كافة المستندات اللازمة لمتابعة إجراءات التمويل:
                </p>
                <h3>تفاصيل العميل:</h3>
                <ul>
                    <li><span style="font-weight: bold;">اسم العميل: </span>${payload.fullName}</li>
                    <li><span style="font-weight: bold;">رقم الجوال: </span>${user.phoneNumber.replace('+', '')}+</li>
                </ul>
                <h3>تفاصيل السيارة:</h3>
                <ul>
                    <li><span style="font-weight: bold;">ماركة السيارة: </span>${brand.nameAr}</li>
                    <li><span style="font-weight: bold;">نوع السيارة: </span>${modelAttribute.value.arName}</li>
                    <li><span style="font-weight: bold;">سنة الصنع: </span>
                        <span style="direction: ltr; display: inline-block;">${yearAttribute.value.arName}</span>
                    </li>
                    <li><span style="font-weight: bold;">سعر السيارة: </span>
                        <span style="direction: ltr; display: inline-block;">${sellPrice.toFixed(2)}</span>
                    </li>
                </ul>
                <p>
                    نرجو منكم التكرم بمراجعة الطلب والمستندات المرفقة، والتواصل معنا في حال احتياجكم
                    لأي معلومات إضافية أو توضيحات.
                </p>
                <p>
                    نشكركم على تعاونكم ونتطلع إلى متابعة طلب العميل في أقرب وقت ممكن.
                </p>
                <p><strong>وتفضلوا بقبول فائق الاحترام والتقدير،</strong></p>
                <p>منصة سوم</p>
                </div>`,
    };

    if (fileNames.length > 0 && fileContents.length > 0) {
      emailOptions.fileName = fileNames;
      emailOptions.fileContent = fileContents;
    }

    const [sendError] = await this.sendGridClient.send(emailOptions);

    if (sendError) {
      console.log('error sending email is>>>', sendError);
      return { code: 400, message: MESSAGE.FAILED };
    }

    console.log('email sent>>>');

    if (payload.orderId) {
      await this.v2Service.updateOrderAttribute({
        orderId: payload.orderId,
      });
    }
    console.log('after updateOrderAttribute>>>');

    return { code: 200, message: MESSAGE.SUCCESS };
  }

  extractFileData(files: Express.Multer.File[] = []) {
    const fileNames = files.map(
      (file, index) => `${index + 1}-${file.originalname}`,
    );
    const fileContents = files.map((file) => file.buffer);
    return { fileNames, fileContents };
  }

  findAttribute(attributes: any[], attributeName: string) {
    return attributes.find((attr: any) => attr.title.enName === attributeName);
  }
}
