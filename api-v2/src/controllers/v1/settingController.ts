import { Request, Response, Router } from 'express';
import _isEmpty from 'lodash/isEmpty';
import { Container } from 'typedi';
import { param, body, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import {
  deleteCache,
  deleteWithPattern,
  flushAll,
  getCache,
  setCache,
} from '../../libs/redis';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { SettingDocument, SettingInput } from '../../models/Setting';
import { SettingService } from '../../services/settingService';
import { isAdminAccess } from '../../util/authentication';
import { _get } from '../../util/common';
import IController from './IController';
import { ReportingService } from '../../services/reportingService';
import {
  validateVersion,
  VersionValidationDto,
} from '../../util/versionValidation';

export class SettingController implements IController {
  path = 'setting/';
  router: Router;
  settingService: SettingService;
  reportingService: ReportingService;
  constructor(router: Router) {
    this.router = router;
    this.settingService = Container.get(SettingService);
    this.reportingService = Container.get(ReportingService);
  }

  initializeRoutes() {
    this.router.get('/', this.getAllSettings);
    this.router.post('/', this.validateAddSettingInput(), this.addSetting);
    this.router.get('/migrate', AuthGuardDM, this.migrateSettings);
    this.router.get('/manual-cache', this.cacheOperating);
    this.router.get(
      '/:settingId',
      [
        param('settingId')
          .trim()
          .isString()
          .withMessage(
            'settingId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getSetting
    );
    this.router.get(
      '/:name/value',
      [
        param('name')
          .trim()
          .isString()
          .withMessage(
            'name' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getSettingByName
    );
    this.router.put(
      '/:settingId',
      this.validateUpdateSettingInput(),
      this.updateSetting
    );
    this.router.delete(
      '/:settingId',
      [
        AuthGuardDM,
        param('settingId')
          .trim()
          .isString()
          .withMessage(
            'settingId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.deleteSetting
    );
    this.router.post(
      '/filter',
      [
        body('categories')
          .trim()
          .isString()
          .optional()
          .withMessage(
            'categories' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('categories').default(''),
        body('status')
          .trim()
          .isString()
          .optional()
          .withMessage(
            'status' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('status').default('Enabled'),
      ],
      this.filterSetting
    );
  }

  getAllSettings = async (req: Request, res: Response) => {
    try {
      const clientType = req.headers['client-id'] as string;
      const version = req.headers['app-version'] as string;
      const cacheSettings: SettingDocument[] | string = await getCache<
        SettingDocument[]
      >('all_settings');
      if (_isEmpty(cacheSettings)) {
        const [err, result] = await this.settingService.getAllSettings();
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.SETTING_NOT_FOUND,
              result.toString()
            )
          );
        } else {
          await setCache('all_settings', result);
          const validateVersionResult = await validateVersion(
            { clientType, version } as VersionValidationDto,
            result
          );
          if (!validateVersionResult) return res.status(426).end();
          return res.sendOk(result, Constants.MESSAGE.SETTING_GET_SUCCESS);
        }
      } else {
        const validateVersionResult = await validateVersion(
          { clientType, version } as VersionValidationDto,
          cacheSettings as SettingDocument[]
        );
        if (!validateVersionResult) return res.status(426).end();
        return res.sendOk(cacheSettings, Constants.MESSAGE.SETTING_GET_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            exception.message
          )
        );
      }
    }
  };
  getSetting = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_ERROR,
            JSON.stringify(errors.array())
          )
        );
      }
      const settingId = req.params.settingId;
      const cacheSetting = await getCache<SettingDocument>(
        `setting_${settingId}`
      );
      if (_isEmpty(cacheSetting)) {
        const [err, result] = await this.settingService.getSetting(settingId);
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.SETTING_NOT_FOUND,
              result.toString()
            )
          );
        } else {
          setCache(`setting_${settingId}`, result);
          res.sendOk(result, Constants.MESSAGE.SETTING_GET_SUCCESS);
        }
      } else {
        res.sendOk(cacheSetting, Constants.MESSAGE.SETTING_GET_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_ERROR,
            exception.message
          )
        );
      }
    }
  };
  getSettingByName = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_ERROR,
            JSON.stringify(errors.array())
          )
        );
      }
      const name = req.params.name;
      const cacheSetting = await getCache<SettingDocument>(`setting_${name}`);
      if (_isEmpty(cacheSetting)) {
        const [err, result] = await this.settingService.getSettingByName(name);
        if (err || result.length === 0) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.SETTING_NOT_FOUND,
              'fail to get setting'
            )
          );
        } else {
          let settingValue = result[0].value;
          if (settingValue && typeof settingValue == 'string') {
            settingValue = JSON.parse(settingValue);
          }
          setCache(`setting_${name}`, settingValue);
          res.sendOk(settingValue, Constants.MESSAGE.SETTING_GET_SUCCESS);
        }
      } else {
        res.sendOk(cacheSetting, Constants.MESSAGE.SETTING_GET_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_ERROR,
            'fail to get setting'
          )
        );
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_ERROR,
            exception.message
          )
        );
      }
    }
  };
  validateAddSettingInput() {
    return [
      AuthGuardDM,
      body('name')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'name' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('description')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'description' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('type')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'type' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('status')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'status' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
    ];
  }
  addSetting = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }

      const settingParams: SettingInput = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        value: req.body.value,
        setting_category: req.body.category,
        status: req.body.status,
        possible_values: req.body.possible_values,
      };
      const [err, result] = await this.settingService.addSetting(settingParams);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            result.toString()
          )
        );
      } else {
        // Remove old cache
        deleteCache(['all_settings']);
        deleteWithPattern('filter_settings_*');
        deleteWithPattern('settings_*');
        res.sendCreated(result, Constants.MESSAGE.SETTING_ADD_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            exception.message
          )
        );
      }
    }
  };

  validateUpdateSettingInput() {
    return [
      AuthGuardDM,
      param('settingId')
        .trim()
        .isString()
        .withMessage(
          'settingId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('name')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'name' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('name').default(''),
      body('description')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'description' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('description').default(''),
      body('type')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'type' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('type').default('string'),
      body('status')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'status' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('status').default('Enabled'),
    ];
  }
  updateSetting = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }

      const settingId = req.params.settingId;
      const reqData: SettingInput = {
        name: req.body.name || '',
        description: req.body.description || '',
        type: req.body.type || 'string',
        setting_category: req.body.category || 'Global',
        value: req.body.value,
        possible_values: req.body.possible_values || '',
        status: req.body.status || 'Enabled',
      };
      const [error, result] = await this.settingService.updateSetting(
        settingId,
        reqData
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_NOT_FOUND,
            result.toString()
          )
        );
      } else {
        // Remove old cache
        deleteCache(['all_settings']);
        deleteWithPattern('filter_settings_*');
        deleteWithPattern('settings_by_keys*');
        res.sendOk(result, Constants.MESSAGE.SETTING_UPDATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            exception.message
          )
        );
      }
    }
  };

  deleteSetting = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }

      const settingId = req.params.settingId;
      const [error, result] = await this.settingService.removeSetting(
        settingId
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        // Remove old cache
        deleteCache(['all_settings']);
        deleteWithPattern('filter_settings_*');
        res.sendOk(result, Constants.MESSAGE.SETTING_REMOVED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_SETTING,
            exception.message
          )
        );
      }
    }
  };

  filterSetting = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }
      const settingInput: SettingInput = {
        setting_category: _get(req.body, 'categories', '')
          .split(',')
          .map((s: string) => s.trim()),
        status: req.body.status || 'Enabled',
      };

      const cacheKey = `filter_settings_${
        settingInput.status +
        '_' +
        (settingInput.setting_category as string[]).join('_').replace(' ', '_')
      }`;
      const cacheSettings: SettingDocument[] | string = await getCache(
        cacheKey
      );
      if (_isEmpty(cacheSettings)) {
        const [err, result] = await this.settingService.filterSettings(
          settingInput
        );
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
              result.toString()
            )
          );
        } else {
          setCache(cacheKey, result);
          res.sendOk(result, Constants.MESSAGE.SETTING_GET_SUCCESS);
        }
      } else {
        res.sendOk(cacheSettings, Constants.MESSAGE.SETTING_GET_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
            exception.message
          )
        );
      }
    }
  };

  migrateSettings = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }

      const [err, result] = await this.settingService.migrateSettings();
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_MIGRATE_ERROR,
            result.toString()
          )
        );
      } else {
        res.sendOk(result, Constants.MESSAGE.SETTING_MIGRATE_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.SETTING_MIGRATE_ERROR,
            exception.message
          )
        );
      }
    }
  };

  cacheOperating = async (req: Request, res: Response) => {
    try {
      const cacheKeys: string = _get(req, 'query.keys', '').toString();
      const pattern: string = _get(req, 'query.pattern', '').toString();
      if (cacheKeys) {
        if (cacheKeys === 'all') {
          await flushAll();
          res.sendOk('Flush all cache.');
        } else {
          await deleteCache(cacheKeys.split(','));
          res.sendOk(`Delete cache keys: ${cacheKeys}`);
        }
      } else if (pattern) {
        await deleteWithPattern(pattern.concat('*'));
        res.sendOk(`Delete cache pattern ${pattern.concat('*')}`);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.CACHE_MANIPULATE_ERROR,
            exception.message
          )
        );
      }
    }
  };
}
