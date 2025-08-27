import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { parse } from 'csv-parse/sync';
import { lastValueFrom } from 'rxjs';
import { Commission } from '../schemas/commission.schema';
import { CommissionType } from '../enum/commissionType.enum';
import { UserType } from '../enum/userSellerType.enum';
import { Status } from '../enum/status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DynamicCommission,
  DynamicCommissionDocument,
} from '../schemas/dynamic-commission.schema';
import { DynamicCommissionDataDTO } from '@src/modules/product-commission/dto/dynamic-commission.dto';

export interface DynamicCommissionRequest {
  variantId: string;
  conditionId: string;
}

interface FileCheckResponse {
  updated: boolean;
  etag?: string;
  data?: DynamicCommissionDataDTO[];
}

@Injectable()
export class DynamicCommissionService {
  private readonly logger = new Logger(DynamicCommissionService.name);
  private readonly db: any;
  private readonly admin: any;

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(DynamicCommission.name)
    private dynamicCommissionModel: Model<DynamicCommissionDocument>,
  ) {
    this.db = this.dynamicCommissionModel.collection.conn.db;
    this.admin = this.db.admin();
  }

  async getLastRecord(): Promise<DynamicCommissionDocument | null> {
    return this.dynamicCommissionModel
      .findOne()
      .sort({ lastUpdateDate: -1 })
      .lean();
  }

  async getDynamicCommissionPrice(
    params: DynamicCommissionRequest,
  ): Promise<Commission[]> {
    try {
      if (!params.variantId || !params.conditionId) {
        this.logger.warn('Invalid parameters provided for getDynamicCommissionPrice');
        return [];
      }

      const foundRecord = await this.dynamicCommissionModel
        .findOne({
          variant_id: params.variantId,
          condition_id: params.conditionId,
        })
        .lean();

      if (!foundRecord) {
        return [];
      }

      return [
        {
          id: foundRecord.variant_id,
          userType: UserType.ALL_SELLERS,
          isBuyer: true,
          type: CommissionType.PERCENTAGE,
          ranges: null,
          minimum: 0,
          maximum: 100000,
          percentage: foundRecord.final_commission_rate * 100,
          status: Status.ACTIVE,
          name: 'Dynamic Commission',
          createdAt: foundRecord.createdAt,
          updatedAt: foundRecord.updatedAt,
          categoryId: null,
          modelIds: [],
          paymentOptionIds: [],
          priceRange: null,
          commissionModule: null,
        } as Commission,
      ];
    } catch (error) {
      this.logger.error(
        `Error in getDynamicCommissionPrice for variant: ${params.variantId}`,
        error.stack,
      );
      return [];
    }
  }

  private async createTemporaryCollection(
    tempCollectionName: string,
    records: DynamicCommissionDataDTO[],
    etag: string,
  ): Promise<void> {
    const now = new Date();
    const tempCollection = this.db.collection(tempCollectionName);

    const recordsToInsert = records.map(record => ({
      variant_id: record.variant_id,
      condition_id: record.condition_id,
      final_commission_rate: Number(record.final_commission_rate),
      etag,
      lastUpdateDate: now,
      createdAt: now,
      updatedAt: now,
      status: Status.ACTIVE
    }));

    await tempCollection.insertMany(recordsToInsert, { 
      ordered: false,
      writeConcern: { w: 'majority' }
    });

    await this.createCollectionIndexes(tempCollection);
  }

  private async createCollectionIndexes(collection: any): Promise<void> {
    await Promise.all([
      collection.createIndex(
        { variant_id: 1, condition_id: 1 },
        { 
          unique: true,
          background: true,
          sparse: true,
          name: 'variant_id_condition_id_unique'
        }
      ),
      collection.createIndex(
        { lastUpdateDate: -1 },
        { 
          background: true,
          name: 'lastUpdateDate_desc'
        }
      )
    ]);
  }

  private async performCollectionSwap(
    originalCollectionName: string,
    tempCollectionName: string,
    dbName: string,
  ): Promise<void> {
    try {
      try {
        await this.db.collection(originalCollectionName).drop();
      } catch (error) {
        // Ignore error if collection doesn't exist
      }

      await this.admin.command({
        renameCollection: `${dbName}.${tempCollectionName}`,
        to: `${dbName}.${originalCollectionName}`
      });
    } catch (error) {
      this.logger.error('Error during collection swap:', error.stack);
      throw error;
    }
  }

  async updateDynamicCommissions(
    records: DynamicCommissionDataDTO[],
    etag: string,
  ): Promise<void> {
    const tempCollectionName = `dynamic_commission_temp_${Date.now()}`;
    const originalCollectionName = this.dynamicCommissionModel.collection.collectionName;
    const dbName = this.db.databaseName;

    try {
      if (!records?.length) {
        this.logger.warn('No records to update');
        return;
      }

      const startTime = Date.now();
      this.logger.log(`Starting update of ${records.length} records`);

      await this.createTemporaryCollection(tempCollectionName, records, etag);
      this.logger.log(`Temporary collection created in ${Date.now() - startTime}ms`);

      try {
        await this.performCollectionSwap(
          originalCollectionName,
          tempCollectionName,
          dbName
        );

        this.logger.log(`Successfully updated ${records.length} records in ${Date.now() - startTime}ms`);
      } catch (error) {
        this.logger.error('Error during collection swap:', error.stack);
        throw error;
      }

    } catch (error) {
      this.logger.error('Error in updateDynamicCommissions:', error.stack);
      throw error;
    }
  }

  async checkFileAndReadIfChanged(
    lastEtag?: string,
  ): Promise<FileCheckResponse> {
    try {
      const fileUrl = this.config.get<string>('DYNAMIC_COMMISSION_URL');
      if (!fileUrl) {
        throw new Error('DYNAMIC_COMMISSION_URL not configured');
      }

      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(fileUrl, {
          headers: lastEtag ? { 'If-None-Match': lastEtag } : {},
          responseType: 'text',
          timeout: 10000,
        }),
      );

      const newEtag = response.headers.etag;
      const csvString = response.data as string;

      let records = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      const columnsToRemove = ['condition', 'grouped_condition_name'];

      records = records.filter((row) => {
        return !Object.values(row).some((val) => val === '');
      });

      records.forEach((row) => {
        columnsToRemove.forEach((col) => {
          delete row[col];
        });
      });

      return { updated: true, etag: newEtag, data: records };
    } catch (error) {
      if (error.response?.status === 304) {
        return { updated: false };
      }
      this.logger.error('Error in checkFileAndReadIfChanged:', error.stack);
      throw error;
    }
  }
}
