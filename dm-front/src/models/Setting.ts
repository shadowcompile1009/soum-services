import { apiClientV2, apiGatewayClient } from '@/api/client';

const SettingEndpoints = {
  whatsAppSettings:
    'rest/api/v1/dm-orders/settings?key=setting_wa_automation_dmo_phase_1',
  omAutomationSettings:
    'rest/api/v1/dm-orders/settings?key=setting_om_status_automation',
  courierAutomationSettings:
    'rest/api/v1/dm-orders/settings?key=setting_courier_automation',
  pickupServiceSettings:
    'rest/api/v1/dm-orders/settings?key=setting_pickup_service_offering',
  updateWhatsAppSettings: 'rest/api/v1/dm-orders/settings',
  updateOMAutomationSettings:
    'rest/api/v1/dm-orders/settings/om-status-automation',
  updateCourierAutomationSettings:
    'rest/api/v1/dm-orders/settings/courier-automation',
  updatePickupServiceSettings: 'rest/api/v1/dm-orders/settings/pickup-service',
  multiFactorStatus: 'rest/api/v1/dm-auth/mfa/status',
  enableMultiFactor: 'rest/api/v1/dm-auth/mfa/enable',
  walletSettings: 'wallet/wallet-settings',
  questionsSettings(
    categoryId: string | undefined,
    limit: string,
    page: string
  ) {
    return `review/question/filter?categoryId=${categoryId}&size=${limit}&page=${page}`;
  },

  categoriesSettings: '/rest/api/v1/category',
  presignedURL(count: string, fileExtention: string, imageModule: string) {
    return `product/aws/pre-signed-url/?count=${count}&fileExtention=${fileExtention}&imageModule=${imageModule}`;
  },
  changeOrderQuestionSettings(settingsId: string) {
    return `review/question/questionnaire/${settingsId} `;
  },

  addNewQuestionSettings() {
    return `review/question`;
  },
  editQuestionSettings(questionId: string) {
    return `review/question/${questionId}`;
  },
  deleteQuestionSettings(questionId: string) {
    return `review/question/${questionId}`;
  },
  toggleWalletSettings(settingsId: string) {
    return `wallet/wallet-settings/${settingsId}`;
  },
  updateWalletSettingsConfig(settingsId: string) {
    return `wallet/wallet-settings/config/${settingsId}`;
  },
};

interface IResponseProcessingSettings {
  type: string;
  value: boolean;
  templateName: string;
}

interface IReponseMutliFactorAuthStatus {
  mfaStatus: boolean;
}

interface IResponseEnableMultiFactor {
  qrCode: string;
}
interface IResponseWhatsAppSetting {
  buyer_processing: IResponseProcessingSettings;
  seller_processing: IResponseProcessingSettings;
  seller_publishing: IResponseProcessingSettings;
  dispute_message: IResponseProcessingSettings;
  seller_extension_whatsapp_message: IResponseProcessingSettings;
  seller_detection_nudge: IResponseProcessingSettings;
  deletion_nudge_unresponsiveness_deactivation: IResponseProcessingSettings;
}
interface IResponseOMAutomationSetting {
  confirm_unavailable: IResponseProcessingSettings;
  refund: IResponseProcessingSettings;
  await_shipping_pickup: IResponseProcessingSettings;
  backlog_unshipped_orders: IResponseProcessingSettings;
  backlog_unpicked_up_orders: IResponseProcessingSettings;
  backlog_intransit_orders: IResponseProcessingSettings;
  refund_item_unavailable: IResponseProcessingSettings;
  refund_confirmed_timeout: IResponseProcessingSettings;
  setting_payout_status_change_automation: IResponseProcessingSettings;
  setting_item_delivered_automation: IResponseProcessingSettings;
  confirm_available: IResponseProcessingSettings;
}
interface IResponseCourierAutomationsSetting {
  automationToggle: IResponseProcessingSettings;
  pickupToggle: IResponseProcessingSettings;
}

export enum WalletSettingType {
  Global = 'Global',
  Automation = 'Automation',
  'Seller Deposit' = 'Seller Deposit',
}

export const templateOptions = [
  { displayName: 'seller_processing', value: 'seller_processing' },
  { displayName: 'seller_processing_v02', value: 'seller_processing_v02' },
  { displayName: 'seller_processing_v03', value: 'seller_processing_v03' },
];

export interface IConfig {
  name: string;
  display: string;
  value: unknown;
}

export interface IResponseWalletSetting {
  id: string;
  name: string;
  display: string;
  type: WalletSettingType;
  value: boolean;
  description: string;
  config: IConfig[];
  configurable: boolean;
}

export interface IOption {
  nameEn: string;
  nameAr: string;
  score: number;
  imageUrl?: string;
}

export interface IQuestion {
  _id: string;
  questionId: string;
  version: number;
  isRequired: boolean;
  questionEn: string;
  questionAr: string;
  questionType: string;
  status: string;
  sortIndex: number;
  options: IOption[];
}

export interface IItem {
  _id: string;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  categoryId: string;
  questions: IQuestion[];
}

export interface IResponseQuestionSetting {
  items: IItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface IResponseCategorySetting {
  _id: string;
  category_name_ar: string;
  category_name: string;
  mini_category_icon: string;
}

export interface AddNewQuestionDTO {
  questionEn: string;
  questionAr: string;
  questionType: string;
}

export interface EditQuestionDTO {
  questionEn: string;
  questionAr: string;
}

export interface IOrder {
  questionId: string;
  version: number;
  order: number;
  isRequired: boolean;
}

export interface ChangeOrderQuestion {
  descriptionEn: string;
  descriptionAr: string;
  categoryId: string;
  questions: IOrder[];
}

export class Setting {
  static async getPresignedURL({
    count,
    fileExtension,
  }: {
    count: string;
    fileExtension: string;
  }) {
    const endpoint = SettingEndpoints.presignedURL(
      count,
      fileExtension,
      'questionImage'
    );

    const result = await apiGatewayClient.client.get(endpoint);

    return result;
  }
  static async getCategorySettings(): Promise<IResponseCategorySetting[]> {
    const result = await apiClientV2.client.get(
      SettingEndpoints.categoriesSettings
    );

    return result.data.responseData;
  }
  static async getQuestionsSettings({
    limit,
    page,
    categoryId,
  }: {
    limit: string;
    page: string;
    categoryId: string | undefined;
  }): Promise<IResponseQuestionSetting> {
    const result = await apiGatewayClient.client.get(
      SettingEndpoints.questionsSettings(categoryId, limit, page)
    );

    return result.data;
  }
  static async addNewQuestionSettings({
    formValues,
  }: {
    formValues: AddNewQuestionDTO;
  }) {
    const result = await apiGatewayClient.client.post(
      SettingEndpoints.addNewQuestionSettings(),
      formValues
    );

    return result.data;
  }

  static async editQuestionSettings({
    questionId,
    formValues,
  }: {
    questionId: string;
    formValues: EditQuestionDTO;
  }) {
    const result = await apiGatewayClient.client.put(
      SettingEndpoints.editQuestionSettings(questionId),
      formValues
    );

    return result.data;
  }

  static async changeOrderQuestionSettings({
    settingsId,
    formValues,
  }: {
    settingsId: string;
    formValues: ChangeOrderQuestion;
  }) {
    const result = await apiGatewayClient.client.put(
      SettingEndpoints.changeOrderQuestionSettings(settingsId),
      formValues
    );

    return result.data;
  }

  static async deleteQuestionSettings({ questionId }: { questionId: string }) {
    const result = await apiGatewayClient.client.delete(
      SettingEndpoints.deleteQuestionSettings(questionId)
    );

    return result.data;
  }
  static async updateWalletSettingsConfig({
    settingsId,
    config,
  }: {
    settingsId: string;
    config: IConfig[];
  }) {
    const result = await apiGatewayClient.client.put(
      SettingEndpoints.updateWalletSettingsConfig(settingsId),
      config
    );
    return result.data;
  }
  static async getWalletSettings(): Promise<IResponseWalletSetting[]> {
    const result = await apiGatewayClient.client.get(
      SettingEndpoints.walletSettings
    );

    return result.data.items;
  }

  static mapWalletSettings(items: IResponseWalletSetting[] = []) {
    const result: Record<WalletSettingType, IResponseWalletSetting[]> =
      {} as Record<WalletSettingType, IResponseWalletSetting[]>;

    items.forEach((item) => {
      result[item.type] = result[item.type] || [];
      result[item.type].push({ ...item });
    });

    return result;
  }
  static async getWhatsAppSettings(): Promise<IResponseWhatsAppSetting> {
    const result = await apiClientV2.client.get(
      SettingEndpoints.whatsAppSettings
    );

    return result.data.responseData.whatsapp;
  }
  static async getOMAutomationSettings(): Promise<IResponseOMAutomationSetting> {
    const result = await apiClientV2.client.get(
      SettingEndpoints.omAutomationSettings
    );

    return result.data.responseData.automation;
  }
  static async getCourierAutomationsSettings(): Promise<IResponseCourierAutomationsSetting> {
    const result = await apiClientV2.client.get(
      SettingEndpoints.courierAutomationSettings
    );

    return result.data.responseData.smsa;
  }

  static async getPickupServiceSettings() {
    const result = await apiClientV2.client.get(
      SettingEndpoints.pickupServiceSettings
    );

    return result.data.responseData.service;
  }

  static async getMultiFactorAuthStatus(): Promise<IReponseMutliFactorAuthStatus> {
    const result = await apiClientV2.client.get(
      SettingEndpoints.multiFactorStatus
    );

    return result.data.responseData;
  }

  static async enableMultiFactor(
    userId: string
  ): Promise<IResponseEnableMultiFactor> {
    const result = await apiClientV2.client.put(
      SettingEndpoints.enableMultiFactor,
      {
        userId,
      }
    );

    return result.data.responseData;
  }

  static async updateWhatsAppSettings({
    buyer_processing,
    seller_processing,
    seller_publishing,
    dispute_message,
    seller_extension_whatsapp_message,
    seller_detection_nudge,
    deletion_nudge_unresponsiveness_deactivation,
    templateName,
  }: {
    buyer_processing: boolean;
    seller_processing: boolean;
    seller_publishing: boolean;
    dispute_message: boolean;
    seller_extension_whatsapp_message: boolean;
    seller_detection_nudge: boolean;
    deletion_nudge_unresponsiveness_deactivation: boolean;
    templateName?: string;
  }) {
    const result = await apiClientV2.client.put(
      SettingEndpoints.updateWhatsAppSettings,
      {
        whatsapp: {
          buyer_processing: {
            type: 'boolean',
            value: buyer_processing,
          },
          seller_processing: {
            type: 'boolean',
            value: seller_processing,
            templateName,
          },
          seller_publishing: {
            type: 'boolean',
            value: seller_publishing,
          },
          dispute_message: {
            type: 'boolean',
            value: dispute_message,
          },
          seller_extension_whatsapp_message: {
            type: 'boolean',
            value: seller_extension_whatsapp_message,
          },
          seller_detection_nudge: {
            type: 'boolean',
            value: seller_detection_nudge,
          },
          deletion_nudge_unresponsiveness_deactivation: {
            type: 'boolean',
            value: deletion_nudge_unresponsiveness_deactivation,
          },
        },
      }
    );

    return result.data;
  }

  static async updateOMAutomationSettings({
    confirm_unavailable,
    refund,
    await_shipping_pickup,
    backlog_unshipped_orders,
    backlog_unpicked_up_orders,
    backlog_intransit_orders,
    refund_item_unavailable,
    refund_confirmed_timeout,
    setting_payout_status_change_automation,
    setting_item_delivered_automation,
    confirm_available,
  }: {
    confirm_unavailable: boolean;
    refund: boolean;
    await_shipping_pickup: boolean;
    backlog_unshipped_orders: boolean;
    backlog_unpicked_up_orders: boolean;
    backlog_intransit_orders: boolean;
    refund_item_unavailable: boolean;
    refund_confirmed_timeout: boolean;
    setting_payout_status_change_automation: boolean;
    setting_item_delivered_automation: boolean;
    confirm_available: boolean;
  }) {
    const result = await apiClientV2.client.put(
      SettingEndpoints.updateOMAutomationSettings,
      {
        automation: {
          confirm_unavailable: {
            type: 'boolean',
            value: confirm_unavailable,
          },
          refund: {
            type: 'boolean',
            value: refund,
          },
          await_shipping_pickup: {
            type: 'boolean',
            value: await_shipping_pickup,
          },
          backlog_unshipped_orders: {
            type: 'boolean',
            value: backlog_unshipped_orders,
          },
          backlog_unpicked_up_orders: {
            type: 'boolean',
            value: backlog_unpicked_up_orders,
          },
          backlog_intransit_orders: {
            type: 'boolean',
            value: backlog_intransit_orders,
          },
          refund_item_unavailable: {
            type: 'boolean',
            value: refund_item_unavailable,
          },
          refund_confirmed_timeout: {
            type: 'boolean',
            value: refund_confirmed_timeout,
          },
          setting_payout_status_change_automation: {
            type: 'boolean',
            value: setting_payout_status_change_automation,
          },
          setting_item_delivered_automation: {
            type: 'boolean',
            value: setting_item_delivered_automation,
          },
          confirm_available: {
            type: 'boolean',
            value: confirm_available,
          },
        },
      }
    );

    return result.data;
  }

  static async updateCourierAutomationsSettings({
    automationToggle,
  }: {
    automationToggle: boolean;
  }) {
    const result = await apiClientV2.client.put(
      SettingEndpoints.updateCourierAutomationSettings,
      {
        smsa: {
          automationToggle: {
            type: 'boolean',
            value: automationToggle,
          },
        },
      }
    );

    return result.data;
  }

  static async updatePickupServiceSettings({
    pickupToggle,
  }: {
    pickupToggle: boolean;
  }) {
    const result = await apiClientV2.client.put(
      SettingEndpoints.updatePickupServiceSettings,
      {
        service: {
          pickupToggle: {
            type: 'boolean',
            value: pickupToggle,
          },
        },
      }
    );

    return result.data;
  }

  static async toggleWalletSettings(settingsId: string) {
    const result = await apiGatewayClient.client.put(
      SettingEndpoints.toggleWalletSettings(settingsId)
    );

    return result.data;
  }

  public nameEn: string;
  public nameAr: string;
  public score: number;
  public imageUrl: string;

  constructor({
    nameEn,
    score,
    imageUrl,
    nameAr,
  }: {
    nameEn: string;
    score: number;
    imageUrl: string;
    nameAr: string;
  }) {
    this.nameEn = nameEn;
    this.score = score;
    this.nameAr = nameAr;
    this.imageUrl = imageUrl;
  }
}
