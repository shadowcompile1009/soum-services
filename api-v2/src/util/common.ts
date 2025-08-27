import cryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { isValidIBAN } from 'ibantools';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { ObjectId } from 'mongodb';
import { isValidObjectId, Types } from 'mongoose';
import { Constants } from '../constants/constant';
import { InvoiceFormats } from '../enums/InvoiceFormats';
import { PriceRangeInput, TimeTillSold } from '../models/Condition';
import { buyerCreditNoteInvoiceSoumPDF } from '../templates/buyerCreditNote';
import { invoiceBuyerPDF } from '../templates/buyerInvoice';
import { ZATCAinvoiceBuyerPDF } from '../templates/buyerInvoiceZATCA';
import { sellerCreditNoteInvoiceSoumPDF } from '../templates/sellerCreditNote';
import { invoiceSellerPDF } from '../templates/sellerInvoice';
import { ZATCAinvoiceSellerPDF } from '../templates/sellerInvoiceZATCA';

export function generateOTP(maxLength: number) {
  return Math.floor(
    Math.pow(10, maxLength - 1) +
      Math.random() * 9 * Math.pow(10, maxLength - 1)
  );
}

export function validatePhone(phoneNumber: string) {
  const reg = /\(?(05)\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  return reg.test(phoneNumber);
}

export function validatePassword(password: string) {
  const reg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/;
  return reg.test(password);
}

export function generateCode(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function settingScoreCondition(score: string) {
  try {
    const point =
      _isEmpty(score) || !score ? 100 : Number(parseFloat(score).toFixed(2));
    let grade: string;
    let grade_ar: string;
    switch (true) {
      case point >= 98 && point <= 100:
        grade = Constants.product.GRADE.LIKE_NEW.EN;
        grade_ar = Constants.product.GRADE.LIKE_NEW.AR;
        break;
      case point >= 90 && point < 98:
        grade = Constants.product.GRADE.LIGHTLY_USED.EN;
        grade_ar = Constants.product.GRADE.LIGHTLY_USED.AR;
        break;
      case point >= 75 && point < 90:
        grade = Constants.product.GRADE.FAIR.EN;
        grade_ar = Constants.product.GRADE.FAIR.AR;
        break;
      default:
        grade = Constants.product.GRADE.EXTENSIVE_USE.EN;
        grade_ar = Constants.product.GRADE.EXTENSIVE_USE.AR;
        break;
    }
    return {
      score,
      grade,
      grade_ar,
    };
  } catch (exception) {
    throw exception;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function _get(
  targetObj: any,
  targetProp: string,
  defaultValue: any
): any {
  return defaultTo(get(targetObj, targetProp), defaultValue);
}

export function trimAndRemoveLineBreaks(target: string) {
  return target.trim().replace(/(\r\n|\n|\r)/gm, '');
}

export function getObjectId(obj: any): ObjectId {
  if (typeof obj === 'string') {
    return new Types.ObjectId(obj);
  }

  if (isValidObjectId(obj)) {
    return obj as Types.ObjectId;
  }

  return null;
}

export function formatCurrency(
  amount: number | string,
  lang: string = 'ar',
  currency: string = 'sar'
) {
  // Currently just support SAR, so I add to the if condition
  if (lang.toLowerCase() === 'ar' && currency.toLowerCase() === 'sar') {
    return `${amount} ريال`;
  } else {
    return `${amount} SAR`;
  }
}

export function formatPriceInDecimalPoints(
  price: number | string,
  decimals: number = 2
) {
  if (typeof price === 'string') {
    price = price.replace(/,/g, '');
  }
  return Number(
    Math.round(Math.trunc(Number(price) * 1000) / 10) / Math.pow(10, decimals)
  );
}

export function generateRandomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function checkIbanAndAccountIdFormat(encryptedText: string) {
  return (
    isValidIBAN(encryptedText) ||
    /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(encryptedText)
  );
}

// some cases happen with IBAN encrypted twice
// need this fix to decrypt into original data
export function decryptIBAN(encryptedIBANText: string, secretKey: string): any {
  if (encryptedIBANText.length === 0) {
    return '';
  }
  if (isValidIBAN(encryptedIBANText)) {
    return encryptedIBANText;
  }
  const bytes = cryptoJS.AES.decrypt(encryptedIBANText, secretKey);
  const originalIBANText = bytes.toString(cryptoJS.enc.Utf8);
  if (
    isValidIBAN(originalIBANText) ||
    (originalIBANText.toString() || '').includes('SA')
  ) {
    return originalIBANText;
  }
  return decryptIBAN(originalIBANText, secretKey);
}
export function decrypt(encryptedText: string, secretKey: string): any {
  if (encryptedText.length === 0) {
    return '';
  }
  if (checkIbanAndAccountIdFormat(encryptedText)) {
    return encryptedText;
  }
  const bytes = cryptoJS.AES.decrypt(encryptedText, secretKey);
  const originalText = bytes.toString(cryptoJS.enc.Utf8);
  if (checkIbanAndAccountIdFormat(originalText)) {
    return originalText;
  }
  return decrypt(originalText, secretKey);
}
export function encrypt(plainText: string, secretKey: string) {
  return cryptoJS.AES.encrypt(plainText, secretKey).toString();
}

export function generateRandomOperationNumber(type: string) {
  switch (type) {
    case 'listing-fees':
      return (
        'SOUM-LISTING-FEES-' +
        Math.round(new Date().getTime() / 1000) +
        Math.floor(1000 + Math.random() * 9000)
      );
    case 'refund':
      return (
        'SOUM-REFUND-' +
        Math.round(new Date().getTime() / 1000) +
        Math.floor(1000 + Math.random() * 9000)
      );
    case 'payout':
      return (
        'SOUM-PAYOUT-SELLER-' +
        Math.round(new Date().getTime() / 1000) +
        Math.floor(1000 + Math.random() * 9000)
      );
    case 'newOrder':
      return (
        'SOUM' +
        Math.round(new Date().getTime() / 1000) +
        Math.floor(1000 + Math.random() * 9000)
      );
    default:
      return '';
  }
}

export function getParsedValue(value: any, type: string): any {
  switch (type) {
    case 'json':
      if (typeof value === 'string' && value) {
        return JSON.parse(value);
      }
      return value;
    case 'option':
      return String(value).split(',');
    case 'number':
      return Number(value);
    case 'string':
    default:
      return value;
  }
}
export function isCacheEnable(req: any): boolean {
  return _get(req.headers, 'cache', '') === 'enable';
}

export function getHtmlContentAndConfig(
  invoiceFormate: InvoiceFormats,
  invoiceType: string
) {
  if (invoiceType == 'seller') {
    if (invoiceFormate == InvoiceFormats.ZATCA)
      return {
        content: ZATCAinvoiceSellerPDF,
        pdfConfig: { width: 900, height: 1400 },
      };
    else if (invoiceFormate == InvoiceFormats.ZATCA_CREDIT_NOTE)
      return {
        content: sellerCreditNoteInvoiceSoumPDF,
        pdfConfig: { width: 900, height: 1400 },
      };
    return { content: invoiceSellerPDF };
  } else {
    if (invoiceFormate == InvoiceFormats.ZATCA)
      return {
        content: ZATCAinvoiceBuyerPDF,
        pdfConfig: { width: 900, height: 1700 },
      };
    else if (invoiceFormate == InvoiceFormats.ZATCA_CREDIT_NOTE)
      return {
        content: buyerCreditNoteInvoiceSoumPDF,
        pdfConfig: { width: 900, height: 1700 },
      };
    return { content: invoiceBuyerPDF };
  }
}

export function detectTextLang(text: string): string {
  return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
}
export function removeMultipleWhiteSpace(text: string): string {
  return decodeURI(text).replace(/ +/g, ' ');
}
export function sanitizeText(text: string): string {
  const _hamzaLetters = 'أ,آ,ا,إ,ء';
  const diffSpelling = 'كسي';
  if (text.includes(diffSpelling)) {
    return diffSpelling;
  } else {
    const hamzaLetters = _hamzaLetters.split(',');
    let _sanitizedText = text;
    for (let i = 0; i < hamzaLetters.length; i++) {
      _sanitizedText = _sanitizedText.replace(hamzaLetters[i], '-');
    }
    const sanitizedText = _sanitizedText.split('-');
    const keyword = sanitizedText.sort(function (a, b) {
      return b.length - a.length;
    });
    return keyword[0];
  }
}
export function lowerAndUnderscoreText(value: string) {
  if (value.includes('(')) {
    const formattingStr = value?.split('(');
    return unitFormat(formattingStr[0] || '')
      .replace(/ /g, '_')
      .toLowerCase()
      .trim();
  }
  return (value || '').replace(/ /g, '_').toLowerCase().trim();
}

const priceRangeDetailValidation = (
  minExc: number,
  minFair: number,
  minExp: number,
  currentPrice: number,
  condition?: string
) => {
  if (minExc !== 0 || minFair !== 0 || minExp !== 0) {
    if (minExc * minFair * minExp === 0) {
      throw new Error(
        `${condition} || Missing price range / price range can not be 0`
      );
    }

    if (minExc > minFair || minFair > minExp || minExp > currentPrice) {
      throw new Error(
        `${condition} || Invalid price range. Min Fair < Max Fair < Max Expensive < Market price`
      );
    }
  }
};

export function validatePriceRange(
  priceRange: PriceRangeInput,
  currentPrice: number
) {
  if (
    priceRange?.like_new_min_fair === 0 ||
    priceRange?.like_new_max_fair === 0 ||
    priceRange?.like_new_max_expensive === 0
  ) {
    throw new Error(
      `Like New || Missing price range / price range can not be 0`
    );
  }
  const likeNewMinExcellent = priceRange.like_new_min_fair || 0;
  const likeNewMinFair = priceRange.like_new_max_fair || 0;
  const likeNewMinExpensive = priceRange.like_new_max_expensive || 0;

  priceRangeDetailValidation(
    likeNewMinExcellent,
    likeNewMinFair,
    likeNewMinExpensive,
    currentPrice,
    'Like New'
  );

  if (
    priceRange?.lightly_used_min_fair === 0 ||
    priceRange?.lightly_used_max_fair === 0 ||
    priceRange?.lightly_used_max_expensive === 0
  ) {
    throw new Error(
      `Lightly Used || Missing price range / price range can not be 0`
    );
  }

  const lightlyUsedMinExcellent = priceRange.lightly_used_min_fair || 0;
  const lightlyUsedMinFair = priceRange.lightly_used_max_fair || 0;
  const lightlyUsedMinExpensive = priceRange.lightly_used_max_expensive || 0;

  priceRangeDetailValidation(
    lightlyUsedMinExcellent,
    lightlyUsedMinFair,
    lightlyUsedMinExpensive,
    currentPrice,
    'Lightly Used'
  );

  if (
    priceRange?.good_condition_min_fair === 0 ||
    priceRange?.good_condition_max_fair === 0 ||
    priceRange?.good_condition_max_expensive === 0
  ) {
    throw new Error(
      `Good Condition || Missing price range / price range can not be 0`
    );
  }

  const goodConditionMinExcellent = priceRange.good_condition_min_fair || 0;
  const goodConditionMinFair = priceRange.good_condition_max_fair || 0;
  const goodConditionMinExpensive =
    priceRange.good_condition_max_expensive || 0;

  priceRangeDetailValidation(
    goodConditionMinExcellent,
    goodConditionMinFair,
    goodConditionMinExpensive,
    currentPrice,
    'Good Condition'
  );

  if (
    priceRange?.extensively_used_min_fair === 0 ||
    priceRange?.extensively_used_max_fair === 0 ||
    priceRange?.extensively_used_max_expensive === 0
  ) {
    throw new Error(
      `Extensively Used || Missing price range / price range can not be 0`
    );
  }

  const extensivelyUsedMinExcellent = priceRange.extensively_used_min_fair || 0;
  const extensivelyUsedMinFair = priceRange.extensively_used_max_fair || 0;
  const extensivelyUsedMinExpensive =
    priceRange.extensively_used_max_expensive || 0;

  priceRangeDetailValidation(
    extensivelyUsedMinExcellent,
    extensivelyUsedMinFair,
    extensivelyUsedMinExpensive,
    currentPrice,
    'Extensively Used'
  );
}

const timeTillSoldDetailValidation = (
  exc: number,
  fair: number,
  exp: number,
  condition?: string
) => {
  if (exc !== 0 || fair !== 0 || exp !== 0) {
    if (exc * fair * exp === 0) {
      throw new Error(
        `${condition} || Missing time till sold / time till sold can not be 0`
      );
    }

    if (exc > fair || fair > exp) {
      throw new Error(
        `${condition} || Invalid time till sold. Excellent < Fair < Expensive`
      );
    }
  }
};

export function validateTimeTillSold(timeTillSold: TimeTillSold) {
  if (
    timeTillSold?.timeTillSoldLikeNewExcellent === 0 ||
    timeTillSold?.timeTillSoldLikeNewFair === 0 ||
    timeTillSold?.timeTillSoldLikeNewExpensive === 0
  ) {
    throw new Error(
      `Like New || Missing time till sold / time till sold can not be 0`
    );
  }

  const timeTillSoldLikeNewExcellent =
    timeTillSold.timeTillSoldLikeNewExcellent || 0;
  const timeTillSoldLikeNewFair = timeTillSold.timeTillSoldLikeNewFair || 0;
  const timeTillSoldLikeNewExpensive =
    timeTillSold.timeTillSoldLikeNewExpensive || 0;

  timeTillSoldDetailValidation(
    timeTillSoldLikeNewExcellent,
    timeTillSoldLikeNewFair,
    timeTillSoldLikeNewExpensive,
    'Like New'
  );

  if (
    timeTillSold?.timeTillSoldLightlyUsedExpensive === 0 ||
    timeTillSold?.timeTillSoldLightlyUsedFair === 0 ||
    timeTillSold?.timeTillSoldLightlyUsedExcellent === 0
  ) {
    throw new Error(
      `Lightly Used || Missing time till sold / time till sold can not be 0`
    );
  }

  const timeTillSoldLightlyUsedExpensive =
    timeTillSold.timeTillSoldLightlyUsedExpensive || 0;
  const timeTillSoldLightlyUsedFair =
    timeTillSold.timeTillSoldLightlyUsedFair || 0;
  const timeTillSoldLightlyUsedExcellent =
    timeTillSold.timeTillSoldLightlyUsedExcellent || 0;

  timeTillSoldDetailValidation(
    timeTillSoldLightlyUsedExcellent,
    timeTillSoldLightlyUsedFair,
    timeTillSoldLightlyUsedExpensive,
    'Lightly Used'
  );

  if (
    timeTillSold?.timeTillSoldGoodConditionExpensive === 0 ||
    timeTillSold?.timeTillSoldGoodConditionFair === 0 ||
    timeTillSold?.timeTillSoldGoodConditionExcellent === 0
  ) {
    throw new Error(
      `Good Condition || Missing time till sold / time till sold can not be 0`
    );
  }

  const timeTillSoldGoodConditionExpensive =
    timeTillSold.timeTillSoldGoodConditionExpensive || 0;
  const timeTillSoldGoodConditionFair =
    timeTillSold.timeTillSoldGoodConditionFair || 0;
  const timeTillSoldGoodConditionExcellent =
    timeTillSold.timeTillSoldGoodConditionExcellent || 0;

  timeTillSoldDetailValidation(
    timeTillSoldGoodConditionExcellent,
    timeTillSoldGoodConditionFair,
    timeTillSoldGoodConditionExpensive,
    'Good Condition'
  );

  if (
    timeTillSold?.timeTillSoldExtensivelyUsedExpensive === 0 ||
    timeTillSold?.timeTillSoldExtensivelyUsedFair === 0 ||
    timeTillSold?.timeTillSoldExtensivelyUsedExcellent === 0
  ) {
    throw new Error(
      `Extensively Used || Missing time till sold / time till sold can not be 0`
    );
  }
  const timeTillSoldExtensivelyUsedExpensive =
    timeTillSold.timeTillSoldExtensivelyUsedExpensive || 0;
  const timeTillSoldExtensivelyUsedFair =
    timeTillSold.timeTillSoldExtensivelyUsedFair || 0;
  const timeTillSoldExtensivelyUsedExcellent =
    timeTillSold.timeTillSoldExtensivelyUsedExcellent || 0;

  timeTillSoldDetailValidation(
    timeTillSoldExtensivelyUsedExcellent,
    timeTillSoldExtensivelyUsedFair,
    timeTillSoldExtensivelyUsedExpensive,
    'Extensively Used'
  );
}

export const validateQuestionAndAnswer = (input: string) => {
  const digitRegex = /\d+/g;
  const englishNumberRegex =
    /zero|one|two|three|four|five|six|seven|eight|nine/gi;
  const arabicNumberRegex =
    /صفر|واحد|اثنين|ثلاثة|أربعة|خمسة|ستة|سبعة|ثمانية|تسعة/gi;
  const urlRegex =
    /https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
  const specialChars = `[-*+@#$%^&()_=\\[\\]{}|;:'",./<>?~\` \\s]`;

  const banAbWabArRegex = new RegExp(
    [
      `[aA]+${specialChars}*[bB]+${specialChars}*[wWوا]+${specialChars}*[aAاأإآ]+${specialChars}*[bB]+`,
      `[اأإآ]+${specialChars}*ب+${specialChars}*[وا]+${specialChars}*ب+`,
      `[اأإآ]+${specialChars}*ب+${specialChars}*و+${specialChars}*[اأإآ]+${specialChars}*ب+`,
    ].join('|'),
    'gi'
  );
  const banAbWabEnRegex = /\b[aA]b\*?w[aA]+b[!.\s]*\b/gi;

  const digitMatches = input?.match(digitRegex)?.join('')?.split('');
  const englishNumberMatches = input?.match(englishNumberRegex);
  const arabicNumberMatches = input?.match(arabicNumberRegex);
  const banWordsMatches =
    input?.match(banAbWabArRegex) || input?.match(banAbWabEnRegex);

  if (
    (digitMatches?.length ||
      0 + englishNumberMatches?.length ||
      0 + arabicNumberMatches?.length ||
      0) > 3
  ) {
    throw new Error('CONTAINS_MANY_NUMBERS');
  }

  if (urlRegex.test(input)) {
    throw new Error('CONTAINS_URL');
  }

  if (banWordsMatches?.length || 0 > 0) {
    throw new Error('CONTAINS_BANNED_WORDS');
  }
};

export function formatTimeZone(
  dateTime: Date | string,
  timeZone = Constants.RIYADH_TIMEZONE
): string {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const utcDatetime = dayjs.utc(dateTime);
  const timeZoneDatetime = utcDatetime.tz(timeZone);
  const formattedDatetime = timeZoneDatetime.format('MM/DD/YYYY h:mm:ss a');

  return formattedDatetime;
}

export function calculatePercentage(havingAmount: number, totalAmount: number) {
  return (havingAmount * 100) / totalAmount;
}

export const normalize = (x: any) =>
  typeof x === 'string' ? x.toLowerCase() : x;

export const isUUIDv4 = (body: string): boolean => {
  const presetConditionUUIDRegex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  return presetConditionUUIDRegex.test(body);
};
export const isNumber = (value: string): boolean => {
  const regex = /^\d+(\.\d+)?$/;
  return regex.test(value.trim());
};
export const isGeneration = (value: string): boolean => {
  const regex = /^(\d+)(st|nd|rd|th) gen\./;
  return regex.test(value.trim());
};

export const parseYear = (value: string): number => {
  return parseInt(value.match(/\d+/)?.[0]) || 0;
};
export const unitFormat = (value: string): string => {
  return value.replace(/\d+(\.\d+)?/g, '').trim();
};

export const validateImagesQualityScore = (value: any) => {
  if (!value || isNaN(value)) {
    return true;
  }
  const intValue = parseInt(value, 10);
  return intValue >= 0 && intValue <= 10;
};

export const getDataRangeAnalytics = (range: string) => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;
  switch (range.toLowerCase()) {
    case 'thismonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'lastmonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case 'thisyear':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    case 'last7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case 'last30days':
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
  }
  return {
    startDate,
    endDate,
  };
};
