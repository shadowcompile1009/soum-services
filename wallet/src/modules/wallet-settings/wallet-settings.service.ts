import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { PaginatedDto } from '@src/dto/paginated.dto';
import {
  WalletSettings,
  WalletSettingsSchemaDocument,
} from '@src/modules/wallet-settings/schemas/wallet-settings.schema';
import {
  WalletSettingsConfig,
  WalletSettingsConfigDocument,
} from '@src/modules/wallet-settings/schemas/wallet-settings-config.schema';
import { BaseWalletSettingsDto } from '@src/modules/wallet-settings/dto/base-wallet-settings.dto';
import {
  createEventLog,
  EventLogRequest,
  EventLogTemplateRequest,
  getTemplateMsgToCreateEventLog,
} from '@src/utils/activitylogs.util';
import { V2Service } from '../v2/v2.service';

export interface EnrichedWalletSettings extends WalletSettings {
  config?: WalletSettingsConfig;
}

@Injectable()
export class WalletSettingsService implements OnModuleInit {
  private readonly logger = new Logger(WalletSettingsService.name);

  constructor(
    @InjectModel(WalletSettings.name)
    private readonly walletSettingsModel: Model<WalletSettingsSchemaDocument>,
    @InjectModel(WalletSettingsConfig.name)
    private readonly walletSettingsConfigModel: Model<WalletSettingsConfigDocument>,
    private configService: ConfigService,
    readonly v2Service: V2Service,
  ) {}

  async onModuleInit() {
    try {
      const walletSettings = JSON.parse(
        this.configService.get('walletSettings.settings'),
      );

      const walletConfigs = JSON.parse(
        this.configService.get('walletSettings.config'),
      );

      const settings = await Promise.all(
        walletSettings.map(async (setting) => {
          const oldSetting = await this.walletSettingsModel.findOne({
            name: setting.name,
          });

          if (oldSetting) return oldSetting;

          const newSetting = await this.walletSettingsModel.create({
            ...setting,
          });

          return newSetting;
        }),
      );

      await Promise.all(
        settings.filter(async (setting) => {
          if (setting?.configurable) {
            const configuration = walletConfigs[setting.name];

            if (!configuration) {
              this.logger.error(
                `Please provide configuration for ${setting.name}'s setting`,
              );
              return false;
            }

            const oldConfig = await this.walletSettingsConfigModel.findOne({
              walletSettingsId: setting.id,
            });

            if (oldConfig) return true;

            await this.walletSettingsConfigModel.create({
              walletSettingsId: setting.id,
              config: JSON.stringify(configuration),
            });

            return true;
          }
        }),
      );
    } catch (exception) {
      this.logger.error(exception.message);
    }
  }

  async findAll({
    offset,
    limit,
    search,
  }): Promise<PaginatedDto<WalletSettings>> {
    const matchCondition = search ? { $text: { $search: search } } : {};
    const res = await this.walletSettingsModel
      .find(matchCondition)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: 1 })
      .exec();

    const count = await this.walletSettingsModel.count(matchCondition).exec();
    return {
      items: res,
      total: count,
      limit: limit,
      offset: offset,
    };
  }

  private async collectSettingsId(settings: WalletSettingsSchemaDocument[]) {
    const settingIds = new Set<string>();

    settings.forEach((setting) => {
      if (setting.configurable) {
        settingIds.add(setting.id);
      }
    });

    return settingIds;
  }

  async getSettingsWithConfig({
    offset,
    limit,
    search,
  }): Promise<PaginatedDto<EnrichedWalletSettings>> {
    const settings = await this.findAll({ offset, limit, search });

    const settingsId = await this.collectSettingsId(
      settings.items as WalletSettingsSchemaDocument[],
    );

    const config = await this.walletSettingsConfigModel.find({
      walletSettingsId: { $in: [...settingsId] },
    });

    const getSettingsWithConfig = await this.addConfigToSettings(
      settings.items,
      config,
    );

    return {
      items: getSettingsWithConfig,
      total: settings.total,
      limit: settings.limit,
      offset: settings.offset,
    };
  }

  async addConfigToSettings(
    settings: WalletSettings[],
    config: WalletSettingsConfigDocument[],
  ): Promise<EnrichedWalletSettings[]> {
    const configHash = config.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.walletSettingsId]: {
          ...(curr instanceof Document ? curr.toObject() : curr),
        },
      };
    }, {});

    return settings.map((setting: WalletSettingsSchemaDocument) => {
      const settingsConfig = configHash[setting.id];
      return {
        ...(setting instanceof Document ? setting.toObject() : setting),
        config: settingsConfig ? JSON.parse(settingsConfig.config) : [],
      };
    });
  }

  async create(
    walletSettingsDto: BaseWalletSettingsDto,
  ): Promise<WalletSettings> {
    const walletSettings = await new this.walletSettingsModel(
      walletSettingsDto,
    );
    await walletSettings.save();
    return walletSettings;
  }

  async toggleSettingsValue(userId: string, settingsId: string) {
    const updatedSettings = await this.walletSettingsModel
      .findByIdAndUpdate(
        { _id: settingsId },
        [
          {
            $set: { value: { $eq: [false, '$value'] }, updatedAt: new Date() },
          },
        ],
        { new: true },
      )
      .exec();

    if (!updatedSettings) {
      throw new BadRequestException('Settings id is invalid');
    }
    // trigger event to create log
    const username = await this.getOnlyDmUserName(userId);
    await this.createActivityLogUpdateSettingEvent(
      userId,
      username,
      updatedSettings.value,
      updatedSettings.name,
    );
    return updatedSettings;
  }

  async createActivityLogUpdateSettingEvent(
    userId: string,
    username: string,
    isOn: boolean,
    nameSettings: string,
  ) {
    try {
      const eventType = 'SOUM Wallet';
      let settingType = '';
      switch (nameSettings) {
        case 'sellerWalletPayout':
          settingType = 'Payout Automation';
          break;
        case 'walletToggle':
          settingType = 'SOUM wallet';
          break;
        case 'sellerDepositList':
          settingType = 'Seller listing fee';
          break;
        default:
          break;
      }
      // get msg template to create log
      const msgToggleWalletSettingTemplateRequest: EventLogTemplateRequest = {
        eventType: nameSettings,
        setting: settingType,
        settingValue: isOn ? 'On' : 'Off',
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgToggleWalletSettingTemplateRequest,
      );
      const eventLogAddUserRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        value: msgTemplate,
        module: 'settings',
      };
      await createEventLog(eventLogAddUserRequest);
    } catch (exception) {
      this.logger.error(exception.message);
    }
  }

  async findByNames(name: string | string[]): Promise<WalletSettings[]> {
    return await this.walletSettingsModel.find({ name: { $in: name } }).exec();
  }

  async updateWalletConfig(settingsId: string, config: any) {
    const updatedConfig = await this.walletSettingsConfigModel.findOneAndUpdate(
      {
        walletSettingsId: settingsId,
      },
      {
        config: JSON.stringify(config),
      },
      { new: true },
    );

    if (!updatedConfig) {
      throw new BadRequestException('Settings id is invalid');
    }
    return updatedConfig;
  }
  async getListingFee(settingKey: string) {
    const sellerDepositListFeeWalletSetting = await this.walletSettingsModel
      .findOne({
        name: settingKey,
      })
      .exec();
    if (!sellerDepositListFeeWalletSetting) {
      throw new BadRequestException('Settings key is invalid');
    }
    const listingFee = await this.walletSettingsConfigModel
      .findOne({
        walletSettingsId: sellerDepositListFeeWalletSetting._id.toString(),
      })
      .exec();
    if (!listingFee) {
      throw new BadRequestException('Wallet Setting Id is invalid');
    }
    return listingFee;
  }

  async getOnlyDmUserName(userId: string) {
    const dmUser = await this.v2Service.getDmUserById({
      userId,
    });
    return dmUser.username;
  }
}
