import { Pipe, PipeTransform } from '@angular/core';
import { AesEncryptDescryptService } from 'src/app/services/core/crypto-js/aes-encrypt-descrypt.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {
  constructor(
    private encryptDecryptService: AesEncryptDescryptService,
    private profileService: ProfileService
  ) {}

  transform(value: string, type: 'card' | 'accountID' | 'bic'): string {
    let maskedValue = '';
    switch (type) {
      case 'card':
        let card = this.encryptDecryptService.decrypt(
          value,
          this.profileService.profileData.secretKey
        );
        maskedValue = card.substring(0, 4) + '-XXXX-XXXX-' + card.substring(12);
        break;

      case 'accountID':
        let accountId = this.encryptDecryptService.decrypt(
          value,
          this.profileService.profileData.secretKey
        );
        let maskingLength = Math.ceil(accountId.length * (15 / 100));
        let remainingLength = accountId.length - maskingLength * 2;
        let mask = '';
        for (let i = 0; i < remainingLength; i++) {
          mask += 'X';
        }
        maskedValue =
          accountId.substring(0, maskingLength) +
          mask +
          accountId.substring(accountId.length - maskingLength);
        break;

      case 'bic':
        let bic = this.encryptDecryptService.decrypt(
          value,
          this.profileService.profileData.secretKey
        );
        let bicMaskingLength = Math.ceil(bic.length * (15 / 100));
        let bicRemainingLength = bic.length - bicMaskingLength * 2;
        let bicMask = '';
        for (let i = 0; i < bicRemainingLength; i++) {
          bicMask += 'X';
        }
        maskedValue =
          bic.substring(0, bicMaskingLength) +
          bicMask +
          bic.substring(bic.length - bicMaskingLength);
        break;

      default:
        break;
    }
    return maskedValue;
  }
}
