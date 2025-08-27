import { Injectable } from '@angular/core';

declare var CryptoJS: any;

@Injectable({
  providedIn: 'root'
})
export class AesEncryptDecryptService {

  constructor() { }

  encrypt(value: string, secretKey: string): string {
    return CryptoJS.AES.encrypt(value, secretKey).toString();
  }

  decrypt(textToDecrypt: string, secretKey: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, secretKey).toString(CryptoJS.enc.Utf8);
  }
}
