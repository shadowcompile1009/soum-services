import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import {
  CancellationFeeSettings,
  CancellationFeeSettingsSchemaDocument,
} from './schemas/cancellation-fee-settings.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CancellationFeeSettingsService {
  private readonly logger = new Logger(CancellationFeeSettingsService.name);
  constructor(
    @InjectModel(CancellationFeeSettings.name)
    private readonly cancellationFeeSettingsModel: Model<CancellationFeeSettingsSchemaDocument>,
    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    try {
      const cancellationFeeSettings = JSON.parse(
        this.configService.get('cancellationFeeSettings.settings'),
      );
      const oldSetting = await this.cancellationFeeSettingsModel
        .findOne({
          name: cancellationFeeSettings.name,
        })
        .exec();
      if (oldSetting) return oldSetting;
      const newSetting = await this.cancellationFeeSettingsModel.create(
        cancellationFeeSettings,
      );
      return newSetting;
    } catch (exception) {
      this.logger.error(exception.message);
    }
  }

  async getCancellationFeeSettings(): Promise<CancellationFeeSettingsSchemaDocument> {
    const data = await this.cancellationFeeSettingsModel
      .findOne({
        name: 'cancellationFeeSettings',
      })
      .exec();
    return data instanceof Document ? data.toObject() : data;
  }
  async updateCancellationFeeSettings(
    settingsId: string,
    updateSettings: any,
  ): Promise<CancellationFeeSettingsSchemaDocument> {
    const updatedConfig = await this.cancellationFeeSettingsModel
      .findByIdAndUpdate(
        { _id: settingsId },
        [
          {
            $set: {
              value: updateSettings.value,
              config: updateSettings.config,
            },
          },
        ],
        { new: true },
      )
      .exec();

    if (!updatedConfig) {
      throw new BadRequestException('Cancellation Fee Settings id is invalid');
    }
    return updatedConfig instanceof Document
      ? updatedConfig.toObject()
      : updatedConfig;
  }
}
