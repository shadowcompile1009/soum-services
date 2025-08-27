import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { parse } from 'csv-parse/sync';
import { lastValueFrom } from 'rxjs';
import { CheckEligibilityRequestDTO } from '../dto/consignment.dto';
import {
  TradeInRecoDataDTO,
  TradeInRecoDTO,
  TradeInRecoGetPriceResponseDTO,
} from './dto/trade-in-reco.dto';

@Injectable()
export class TradeInRecoService {
  private readonly logger = new Logger(TradeInRecoService.name);

  constructor(
    @Inject()
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getTradeInRecoPrice(
    params: CheckEligibilityRequestDTO,
  ): Promise<TradeInRecoGetPriceResponseDTO> {
    try {
      const key = 'consignment-trade-in-reco';
      const tradeInRecoFromCache =
        await this.cacheManager.get<TradeInRecoDTO>(key);
      let lastEtag = '';
      let tradeRecoData: TradeInRecoDataDTO[];
      const oneHourBefore = new Date(Date.now() - 60 * 60 * 1000);
      const lastUpdateDate = tradeInRecoFromCache
        ? new Date(tradeInRecoFromCache?.lastUpdateDate)
        : oneHourBefore;

      if (tradeInRecoFromCache?.data) {
        tradeRecoData = tradeInRecoFromCache.data;
      }
      if (lastUpdateDate <= oneHourBefore) {
        lastEtag = tradeInRecoFromCache?.etag || '';
        const response = await this.checkFileAndReadIfChanged(lastEtag);
        if (response.updated) {
          const data: TradeInRecoDTO = {
            etag: response.etag,
            lastUpdateDate: new Date(),
            data: response.data,
          };
          tradeRecoData = response.data;
          await this.cacheManager.set(key, data, 24 * 60 * 60 * 1000);
        }
      }

      const foundRaw: TradeInRecoDataDTO = tradeRecoData.find(
        (item) =>
          item.variant_id === params.variantId &&
          item.condition_id === params.conditionId,
      );

      if (!foundRaw) {
        return {};
      }
      return {
        trade_in_reco: foundRaw?.trade_in_reco,
        resell_reco: foundRaw.resell_reco,
      };
    } catch (error) {
      this.logger.error('TradeInRecoService call error:', error);
      return { trade_in_reco: null, resell_reco: null };
    }
  }

  async checkFileAndReadIfChanged(
    lastEtag?: string,
  ): Promise<{ updated: boolean; etag?: string; data?: any[] }> {
    try {
      const fileUrl = this.config.get('TRADE_IN_RECO_URL');
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(fileUrl, {
          headers: lastEtag ? { 'If-None-Match': lastEtag } : {},
          responseType: 'text',
        }),
      );

      const newEtag = response.headers.etag;
      const csvString = response.data as string;

      let records = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
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
      throw error;
    }
  }
}
