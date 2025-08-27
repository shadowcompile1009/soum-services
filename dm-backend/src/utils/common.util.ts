import { isValidIBAN } from 'ibantools';
import cryptoJS from 'crypto-js';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';

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

export function checkIbanAndAccountIdFormat(encryptedText: string) {
  return (
    isValidIBAN(encryptedText) ||
    /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(encryptedText)
  );
}

export function formatPriceInDecimalPoints(
  price: number | string,
  decimals: number = 2,
) {
  if (typeof price === 'string') {
    price = price.replace(/,/g, '');
  }
  return Number(
    Math.round(Math.trunc(Number(price) * 1000) / 10) / Math.pow(10, decimals),
  );
}

export function _get(
  targetObj: any,
  targetProp: string,
  defaultValue: any,
): any {
  return defaultTo(get(targetObj, targetProp), defaultValue);
}
