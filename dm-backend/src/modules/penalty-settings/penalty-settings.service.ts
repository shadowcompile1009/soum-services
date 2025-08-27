import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  PenaltySettings,
  PenaltySettingsSchemaDocument,
} from './schemas/penalty-settings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PenaltySettingsService {
  private readonly logger = new Logger(PenaltySettingsService.name);
  constructor(
    @InjectModel(PenaltySettings.name)
    private readonly penaltySettingsModel: Model<PenaltySettingsSchemaDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const penaltySettings = JSON.parse(
        this.configService.get('penaltySettings.settings'),
      );

      await Promise.all(
        penaltySettings.map(async (setting) => {
          const oldSetting = await this.penaltySettingsModel
            .findOne({
              name: setting.name,
            })
            .exec();

          if (oldSetting) return oldSetting;

          const newSetting = await this.penaltySettingsModel.create(setting);
          return newSetting;
        }),
      );
    } catch (exception) {
      this.logger.error(exception.message);
    }
  }

  async getPenaltySettings(): Promise<PenaltySettingsSchemaDocument> {
    const data = await this.penaltySettingsModel
      .findOne({
        name: 'penaltySettings',
      })
      .exec();
    return data instanceof Document ? data.toObject() : data;
  }

  async updatePenaltySettings(
    settingsId: string,
    updateSettings: any,
  ): Promise<PenaltySettingsSchemaDocument> {
    const updatedConfig = await this.penaltySettingsModel
      .findByIdAndUpdate(
        { _id: settingsId },
        [
          {
            $set: {
              value: updateSettings.value,
              config: updateSettings.config,
              updatedAt: new Date(),
            },
          },
        ],
        { new: true },
      )
      .exec();

    if (!updatedConfig) {
      throw new BadRequestException('Penalty Settings id is invalid');
    }
    return updatedConfig instanceof Document
      ? updatedConfig.toObject()
      : updatedConfig;
  }
}
