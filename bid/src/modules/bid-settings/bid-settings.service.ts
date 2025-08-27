import {
  Injectable,
  OnModuleInit,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BidSettings,
  BidSettingsSchemaDocument,
} from './schemas/bid-settings.schema';
import { Document, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { BaseBidSettingsDto } from './dto/base-bid-settings.dto';

@Injectable()
export class BidSettingsService implements OnModuleInit {
  private readonly logger = new Logger(BidSettingsService.name);
  constructor(
    @InjectModel(BidSettings.name)
    private readonly bidSettingsModel: Model<BidSettingsSchemaDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const bidSettings = JSON.parse(
        this.configService.get('bidSettings.settings'),
      );

      await Promise.all(
        bidSettings.map(async (setting) => {
          const oldSetting = await this.bidSettingsModel
            .findOne({
              name: setting.name,
            })
            .exec();

          if (oldSetting) return oldSetting;

          const newSetting = await this.bidSettingsModel.create({
            ...setting,
            config: JSON.stringify(setting.config),
          });

          return newSetting;
        }),
      );
    } catch (exception) {
      this.logger.error(exception.message);
    }
  }

  async getBidSettings(): Promise<BidSettingsSchemaDocument> {
    const data = await this.bidSettingsModel
      .findOne({
        name: 'activateBidding',
      })
      .exec();
    const bidSettings = data instanceof Document ? data.toObject() : data;
    return {
      ...bidSettings,
      config: bidSettings?.config ? JSON.parse(bidSettings.config) : null,
    } as BidSettingsSchemaDocument;
  }

  async updateBidSettings(settingsId: string, updateSettings: any) {
    const updatedConfig = await this.bidSettingsModel
      .findByIdAndUpdate(
        { _id: settingsId },
        [
          {
            $set: {
              value: updateSettings.value,
              config: JSON.stringify(updateSettings.config),
              updatedAt: new Date(),
            },
          },
        ],
        { new: true },
      )
      .exec();

    if (!updatedConfig) {
      throw new BadRequestException('Bid Settings id is invalid');
    }
    const updatedBidSettings =
      updatedConfig instanceof Document
        ? updatedConfig.toObject()
        : updatedConfig;
    return {
      ...updatedBidSettings,
      config: updatedBidSettings?.config
        ? JSON.parse(updatedBidSettings.config)
        : null,
    } as BidSettingsSchemaDocument;
  }

  async getBidStartingBidPricePercentage(): Promise<any> {
    const data = await this.bidSettingsModel
      .findOne({
        name: 'activateBidding',
      })
      .exec();
    const bidSettings = data instanceof Document ? data.toObject() : data;
    const config = JSON.parse(bidSettings.config);

    for (const item of config) {
      if (item.name === 'startBidding') return item;
    }
    return null;
  }

  async getBidingBase(): Promise<BaseBidSettingsDto> {
    const data = await this.bidSettingsModel
      .findOne({
        name: 'activateBidding',
      })
      .exec();
    const bidSettings = data instanceof Document ? data.toObject() : data;
    const config = JSON.parse(bidSettings.config);

    for (const item of config) {
      if (item.name === 'biddingBase') return item;
    }
    return null;
  }
}
