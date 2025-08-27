import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { ModelRepository } from '../../../src/repositories/modelRepository';
import { SettingRepository } from '../../../src/repositories/settingRepository';
import {
  getAllActiveModel,
  getSettingByKey,
  updateModelSetting,
} from '../../_data/model';

const baseURL = '/rest/api/v1';

describe('PUT /rest/api/v1/model/update-model-setting', () => {
  test('should return 200 when model setting is updated', async () => {
    const mockGetAllActive = jest.spyOn(
      Container.get(ModelRepository),
      'getAllActive'
    );
    mockGetAllActive.mockImplementation(() => {
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getAllActiveModel as any,
        },
      ]);
    });

    const mockGetSettingByKey = jest.spyOn(
      Container.get(SettingRepository),
      'getSettingByKey'
    );
    mockGetSettingByKey.mockImplementation((keyValue: string) => {
      expect(keyValue).toEqual(Constants.MODEL_SETTING.FULL_MODEL_LIST.NAME);
      return Promise.resolve([false, getSettingByKey]);
    });

    const mockUpdateSetting = jest.spyOn(
      Container.get(SettingRepository),
      'updateSetting'
    );
    mockUpdateSetting.mockImplementation((settingId: string) => {
      expect(settingId).toEqual('628f7ea0c7c609002c9ae76b');
      return Promise.resolve([false, updateModelSetting]);
    });

    const response = await request(app).put(
      baseURL + '/model/update-model-setting'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.MODEL_SETTING_UPDATE_SUCCESS
    );
    expect(response.body.status).toEqual('success');
  });
});
