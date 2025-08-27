import { parse } from 'csv-parse';
import https from 'https';
import mongoose from 'mongoose';
import { BankDto } from '../dto/bank/bankDto';
import {
  NewPriceProductDto,
  PriceNudgeVarientDto,
} from '../dto/condition/priceNudgeVarientDto';
import logger from '../util/logger';

export async function readCSVFile(
  filePath: string
): Promise<PriceNudgeVarientDto[]> {
  const results: PriceNudgeVarientDto[] = [];

  return new Promise((resolve, reject) => {
    https
      .get(filePath, csvResponse => {
        csvResponse
          .pipe(parse({ columns: true, delimiter: ',' }))
          .on('data', row => {
            const data: PriceNudgeVarientDto = {
              brand: row['Brand'],
              model: row['Model'],
              variant: row['Variant'],
              varientId: row['varient_id'],
              condition: row['Condition'],
              marketPrice: row['Market Price'],
            };
            if (
              !data.brand ||
              !data.model ||
              !data.variant ||
              !data.varientId ||
              !data.condition ||
              !data.marketPrice ||
              !mongoose.isValidObjectId(data.varientId)
            ) {
              return reject(new Error('Invalid data'));
            }
            data.condition = data.condition.trim();
            results.push(data);
          })
          .on('error', function (err) {
            logger.error(err);
            reject(err);
          })
          .on('end', () => {
            logger.info('Read price nudge CSV file successfully');
            resolve(results);
          });
      })
      .end();
  });
}

export async function readBankCSVFile(filePath: string): Promise<BankDto[]> {
  const results: BankDto[] = [];

  return new Promise((resolve, reject) => {
    https
      .get(filePath, csvResponse => {
        csvResponse
          .pipe(
            parse({
              comment: '#',
              columns: true,
              relax_quotes: true,
              escape: '\\',
              quote: "'",
              delimiter: ',',
              ltrim: true,
              rtrim: true,
              record_delimiter: '\n',
              skip_empty_lines: true,
              relax_column_count: true,
            })
          )
          .on('data', row => {
            const data: BankDto = {
              bankName: row['English'],
              bankNameAr: row['Arabic'],
              bankCode: row['Swift code'],
            };
            if (!data.bankName || !data.bankNameAr || !data.bankCode) {
              return reject(new Error('Invalid data'));
            }
            results.push(data);
          })
          .on('error', function (err) {
            logger.error(err);
            reject(err);
          })
          .on('end', () => {
            logger.info('Read banks CSV file successfully');
            resolve(results);
          });
      })
      .end();
  });
}

export async function readNewPriceCSVFile(
  filePath: string
): Promise<NewPriceProductDto[]> {
  const results: NewPriceProductDto[] = [];

  return new Promise((resolve, reject) => {
    https
      .get(filePath, csvResponse => {
        csvResponse
          .pipe(parse({ columns: true, delimiter: ',' }))
          .on('data', row => {
            const data: NewPriceProductDto = {
              variantId: row['variant_id']?.trim(),
              newPrice: row['new_price']?.trim(),
            };
            if (
              !data.variantId ||
              !data.newPrice ||
              !mongoose.isValidObjectId(data.variantId)
            ) {
              return reject(new Error('Invalid data'));
            }
            results.push(data);
          })
          .on('error', function (err) {
            logger.error(err);
            reject(err);
          })
          .on('end', () => {
            logger.info('Read new price CSV file successfully');
            resolve(results);
          });
      })
      .end();
  });
}
