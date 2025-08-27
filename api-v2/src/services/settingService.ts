import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { SettingDocument, SettingInput } from '../models/Setting';
import { SettingRepository } from '../repositories/settingRepository';
import { SettingValues } from '../enums/SettingValues';
import { Region } from '../models/Region';
import { UserService } from './userService';
import { GetCountdownValInHoursResponse } from '../grpc/proto/v2/GetCountdownValInHoursResponse';
@Service()
export class SettingService {
  @Inject()
  settingRepository: SettingRepository;

  @Inject()
  userService: UserService;

  async getAllSettings() {
    try {
      return await this.settingRepository.getAllSettings();
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }

  async getSettingsObjectByKeys(keys: string[]) {
    try {
      return await this.settingRepository.getSettingsObjectByKeys(keys);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }

  async getSetting(settingId: string) {
    try {
      return await this.settingRepository.getSettingById(settingId);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }

  async addSetting(obj: SettingInput) {
    try {
      // Update guarantee_feature tags
      if (obj?.name === 'guarantee_feature') {
        await this.userService.updateGuaranteeFeatureTags(
          obj?.value?.split(',')
        );
      }
      return await this.settingRepository.addSetting(obj);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
          exception.message
        );
      }
    }
  }

  async updateSetting(
    settingId: string,
    obj: SettingInput
  ): Promise<[boolean, SettingDocument | string]> {
    try {
      const [error, result] = await this.settingRepository.updateSetting(
        settingId,
        obj
      );
      // Update guarantee_feature tags
      if (obj?.name === 'guarantee_feature') {
        await this.userService.updateGuaranteeFeatureTags(
          obj?.value?.split(',')
        );
      }
      return [error, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
        exception.message
      );
    }
  }

  async removeSetting(settingId: string) {
    try {
      return await this.settingRepository.removeSetting(settingId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_SETTING,
          exception.message
        );
    }
  }

  async filterSettings(filterParams: SettingInput) {
    try {
      return await this.settingRepository.filterSettings(filterParams);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }

  async migrateSettings() {
    try {
      return await this.settingRepository.migrateSettings();
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.SETTING_MIGRATE_ERROR,
        exception.message
      );
    }
  }
  async getSettingsWithKeys(keys: string[]) {
    try {
      return await this.settingRepository.getSettingByKeys(keys);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }
  async getSettingByName(name: string) {
    try {
      return await this.settingRepository.getSettingByKeys([name]);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }
  async getRegionConfigs(): Promise<Region> {
    const [settingsError, settings] = await this.getSettingsWithKeys([
      SettingValues.REGION,
    ]);

    if (settingsError) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.REGION_SETTINGS_NOT_ENABLED
      );
    }
    const regionSettings: SettingDocument[] = settings as SettingDocument[];
    if (
      !regionSettings.find((elem: any) => elem.name == SettingValues.REGION)
        .value
    )
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.REGION_SETTINGS_NOT_ENABLED,
        Constants.MESSAGE.REGION_SETTINGS_NOT_ENABLED
      );

    let regionValue = settings[0].value as Region;
    if (regionValue && typeof regionValue == 'string') {
      regionValue = JSON.parse(regionValue);
    }

    return regionValue;
  }

  async getCountdownValInHours(modelId: string) {
    try {
      const [errSettings, sysSettings] = await this.getSettingsObjectByKeys([
        'deactivation_message_countdown',
        'send_deactivation_messages',
      ]);
      if (errSettings)
        return { countdownValInHours: 0 } as GetCountdownValInHoursResponse;

      const modelsStr = sysSettings['send_deactivation_messages'];
      const modelExists = modelsStr?.includes(modelId);

      if (modelExists)
        return { countdownValInHours: 0 } as GetCountdownValInHoursResponse;

      const countdownValInHours = sysSettings['deactivation_message_countdown'];
      return {
        countdownValInHours: countdownValInHours,
      } as GetCountdownValInHoursResponse;
    } catch (err) {}
  }
}
