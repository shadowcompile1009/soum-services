import { Pipe, PipeTransform } from '@angular/core';
import { AesEncryptDescryptService } from 'src/app/services/core/crypto-js/aes-encrypt-descrypt.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Pipe({
  name: 'decrypt'
})
export class DecryptPipe implements PipeTransform {
  /**
   *
   */
  constructor(
    private decryptService?: AesEncryptDescryptService,
    private profileService?: ProfileService
  ) {}

  transform(value: string): unknown {
    if (this.profileService.profileData) {
      return this.decryptService.decrypt(
        value,
        this.profileService.profileData.secretKey
      );
    } else {
      return 'no';
    }
  }
}
