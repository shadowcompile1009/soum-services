import { Pipe, PipeTransform } from '@angular/core';
import { AesEncryptDecryptService } from 'src/app/services/aes-encrypt-decrypt/aes-encrypt-decrypt.service';

@Pipe({
  name: 'decrypt'
})
export class DecryptPipe implements PipeTransform {

  constructor(
    private decryptService: AesEncryptDecryptService,
  ) {


  }

  transform(value: string, secretKey: string): unknown {
    if (!value) {
      return '';
    }
    return this.decryptService.decrypt(value, secretKey);
  }

}
