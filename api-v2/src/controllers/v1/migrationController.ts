import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { MigrationService } from '../../services/migrationService';
import { VariantMigrationService } from '../../services/variantMigrationService';
import { QuestionnaireService } from '../../services/questionnaireService';
import IController from './IController';
import { _get } from '../../util/common';
export class MigrationController implements IController {
  path = 'migration/';
  router: Router;
  questionnaireService: QuestionnaireService;
  migrationService: MigrationService;
  varientMigrationService: VariantMigrationService;
  constructor(router: Router) {
    this.router = router;
    this.questionnaireService = Container.get(QuestionnaireService);
    this.migrationService = Container.get(MigrationService);
    this.varientMigrationService = Container.get(VariantMigrationService);
  }

  initializeRoutes() {
    this.router.get('/response', this.generateResponse);
    this.router.delete('/', this.resetQuestionnaire);
    this.router.get('/variant', this.generateVariantData);
    this.router.delete('/clear-unused-models', this.deleteModels);
    this.router.get('/variant-mapping', this.mappingVariants);
    this.router.get(
      '/variant-mapping/clean-sheet-data',
      this.cleanVariantMappingSheetData
    );
    this.router.get('/change-image-urls', this.changeProductImageUrls);
  }

  generateResponse = async (_req: Request, res: Response) => {
    try {
      const product = await this.migrationService.generateResponse();

      res.sendOk(product, 'Question migration is done');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MIGRATE_QUESTION,
            exception.message
          )
        );
      }
    }
  };

  // clear all questionnaire
  resetQuestionnaire = async (_req: Request, res: Response) => {
    try {
      const [err, result] =
        await this.questionnaireService.removeAllQuestionnaire();
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
            exception.message
          )
        );
      }
    }
  };

  generateVariantData = async (req: Request, res: Response) => {
    try {
      const numberOfRecords = Number(_get(req.query, 'numRecords', 500));
      const result = await this.varientMigrationService.generateVariantData(
        numberOfRecords
      );
      if (!result) {
        res.sendOk([], 'Variant Data migration is done');
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MIGRATE_NEW_ADDRESS_FORMAT,
            exception.message
          )
        );
      }
    }
  };

  mappingVariants = async (req: Request, res: Response) => {
    try {
      const result =
        await this.varientMigrationService.mappingVariantOfProducts();
      if (!result) {
        res.sendOk([], 'Variant Model Mapping is done');
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MAPPING_VARIANT_DATA,
            exception.message
          )
        );
      }
    }
  };

  cleanVariantMappingSheetData = async (req: Request, res: Response) => {
    try {
      const result =
        await this.varientMigrationService.cleanVariantMappingSheetData();
      if (!result) {
        res.sendOk([], 'Clean variant map collection successfully');
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MIGRATE_NEW_ADDRESS_FORMAT,
            exception.message
          )
        );
      }
    }
  };

  deleteModels = async (req: Request, res: Response) => {
    try {
      const result = await this.varientMigrationService.deleteUnusedModels();
      if (!result) {
        res.sendOk([], 'Clean models successfully');
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MIGRATE_NEW_ADDRESS_FORMAT,
            exception.message
          )
        );
      }
    }
  };

  changeProductImageUrls = async (req: Request, res: Response) => {
    const numberOfRecords = Number(_get(req.query, 'numRecords', 1000));
    const from = _get(req.query, 'from', '');
    const to = _get(req.query, 'to', '');
    const result = await this.migrationService.changeProductImageUrls(
      numberOfRecords,
      from,
      to
    );
    if (!result) {
      res.sendOk([], 'Change image url unsuccessfully');
    } else {
      res.sendOk(result[1], result[1]?.message);
    }
  };
}
