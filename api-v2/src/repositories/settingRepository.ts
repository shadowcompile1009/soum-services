import _isEmpty from 'lodash/isEmpty';
import { ClientSession, LeanDocument } from 'mongoose';
import { SettingStatuses } from '../enums/SettingValues';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { LegacySetting } from '../models/LegacySetting';
import { Setting, SettingDocument, SettingInput } from '../models/Setting';
import {
  getCache,
  setCache,
  deleteCache,
  createKey,
  deleteWithPattern,
} from '../libs/redis';
import { getParsedValue } from '../util/common';

@Service()
export class SettingRepository {
  async getAllSettings(): Promise<any> {
    try {
      const cacheSettings: SettingDocument[] | string = await getCache<
        SettingDocument[]
      >('all_settings');

      if (_isEmpty(cacheSettings)) {
        const settings = await Setting.find({ status: SettingStatuses.ENABLED })
          .select(
            'name description type setting_category value possible_values status'
          )
          .exec();

        if (!settings) {
          return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
        }
        await setCache('all_settings', settings);
        return [false, settings];
      }

      return [false, cacheSettings];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getSettingsObjectByKeys(
    keys: string[]
  ): Promise<[boolean, { [key: string]: any }]> {
    const [error, systemSettings] = await this.getSettingByKeys(keys);
    if (error) {
      return [
        true,
        {
          message: Constants.MESSAGE.FAILED_TO_GET_SETTING,
        },
      ];
    }
    const settings: { [key: string]: any } = (
      systemSettings as LeanDocument<SettingDocument>[]
    ).reduce(
      (prev, current) => ({
        ...prev,
        [current.name]: getParsedValue(current.value, current.type),
      }),
      {}
    );
    return [false, settings];
  }

  async getSettingById(settingId: string) {
    try {
      const cacheSetting = await getCache<SettingDocument>(
        `setting_${settingId}`
      );

      if (_isEmpty(cacheSetting)) {
        const setting = await Setting.findById(settingId)
          .select(
            'name description type setting_category value possible_values status'
          )
          .exec();
        if (!setting) {
          return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
        }
        await setCache(`setting_${settingId}`, setting);

        return [false, setting];
      }

      return [false, cacheSetting];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  updateValueWithOptions = (possible_values: any) => {
    const value: string[] = [];
    if (!_isEmpty(possible_values)) {
      possible_values.forEach((element: any) => {
        if (element.isSelected) {
          value.push(element.option);
        }
      });
    }
    return value.join(',');
  };

  async addSetting(
    obj: SettingInput,
    session?: ClientSession
  ): Promise<[boolean, SettingDocument | string]> {
    try {
      const newSetting: SettingDocument = new Setting();
      newSetting.name = obj.name;
      newSetting.description = obj.description;
      newSetting.type = obj.type;
      newSetting.setting_category = obj.setting_category.toString();
      newSetting.possible_values = obj.possible_values;
      newSetting.value =
        this.updateValueWithOptions(newSetting.possible_values) || obj.value;
      newSetting.status = obj.status;
      const data = await newSetting.save(session ? { session: session } : null);

      if (!data || !data._id) {
        return [true, Constants.MESSAGE.CAN_NOT_CREATE_SETTING];
      }

      await deleteCache(['all_settings']);
      await deleteWithPattern('settings_*');
      await setCache(`setting_${data?._id?.toString()}`, data);

      return [false, data];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }

  async updateSetting(settingId: string, updatingData: SettingInput) {
    try {
      const updatingSetting: SettingDocument = await Setting.findById(
        settingId
      ).exec();
      if (!updatingSetting) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }

      updatingSetting.name = updatingData.name || updatingSetting.name;
      updatingSetting.description =
        updatingData.description || updatingSetting.description;
      updatingSetting.type = updatingData.type || updatingSetting.type;
      updatingSetting.setting_category =
        updatingData.setting_category.toString() ||
        updatingSetting.setting_category;
      updatingSetting.possible_values =
        updatingData.possible_values || updatingSetting.possible_values;
      updatingSetting.value =
        this.updateValueWithOptions(updatingSetting.possible_values) ||
        updatingData.value;
      updatingSetting.status = updatingData.status || updatingSetting.status;
      await updatingSetting.save();
      await deleteCache([`setting_${settingId}`, 'all_settings']);
      await deleteWithPattern('settings_*');

      return [false, updatingSetting];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        return [true, Constants.ERROR_MAP.DUPLICATE_REQUEST];
      } else {
        return [true, exception.message];
      }
    }
  }

  async removeSetting(settingId: string) {
    try {
      const deletingSetting = await Setting.findById(settingId).exec();
      if (!deletingSetting) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }

      await deletingSetting.remove();
      await deleteCache([`setting_${settingId}`, 'all_settings']);

      return [false, Constants.MESSAGE.SETTING_REMOVED_SUCCESS];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async filterSettings(
    filterParams: any
  ): Promise<[boolean, string | LeanDocument<SettingDocument>[]]> {
    try {
      Object.keys(filterParams).forEach(k => {
        if (_isEmpty(filterParams[k])) {
          return (filterParams[k] = null);
        }
        if (Array.isArray(filterParams[k])) {
          return (filterParams[k] = { $in: filterParams[k] });
        }
      });

      const result = await Setting.find(filterParams)
        .select('name description type setting_category value status')
        .lean()
        .exec();
      if (!result) {
        return [true, Constants.ERROR_MAP.SETTING_NOT_FOUND];
      }
      return [false, result];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  mapV1SettingType(value: any) {
    switch (typeof value) {
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      default:
        return 'string';
    }
  }
  async migrateSettings() {
    try {
      const result: any = await LegacySetting.findOne().lean().exec();
      if (!result) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      return Promise.all(
        Object.keys(result).map(key => {
          if (!['_id', '__v', 'created_at', 'updated_at'].includes(key)) {
            const migratingSetting = new Setting();
            migratingSetting.name = key;
            migratingSetting.description = key;
            migratingSetting.setting_category = 'Global';
            migratingSetting.type = this.mapV1SettingType(result[key]);
            migratingSetting.value = result[key];
            return migratingSetting.save();
          }
          return null;
        })
      ).then(settings => {
        return [false, settings.filter(s => s)];
      });
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getSettingByKey(setting_key: string) {
    try {
      const setting = await Setting.findOne({ name: setting_key }).exec();
      if (!setting) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      return [false, setting];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getSettingByKeys(setting_keys: string[]) {
    try {
      const key = createKey('settings_by_keys', setting_keys);
      const cacheSettingsByKeys: SettingDocument[] | string = await getCache<
        SettingDocument[]
      >(key);

      if (_isEmpty(cacheSettingsByKeys)) {
        const setting = await Setting.find({
          name: { $in: setting_keys },
        }).exec();
        if (!setting) {
          return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
        }
        await setCache(key, setting);
        return [false, setting];
      }
      return [false, cacheSettingsByKeys];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async updateInvoiceNoSetting(userType: string, currentNumber: number) {
    try {
      const data = await Setting.findOne({ name: 'setting_invoice' }).exec();
      if (!data) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      const setting = JSON.parse(data.value);
      setting[`${userType}`].current_number = currentNumber;

      data.value = JSON.stringify(setting);
      await data.save();
      await deleteCache([`setting_${data?._id?.toString()}`, 'all_settings']);

      return [false, 'Done to update current number invoice setting'];
    } catch (exception) {
      return [true, exception.message];
    }
  }
}
