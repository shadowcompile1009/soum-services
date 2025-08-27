import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CommonService } from 'src/app/services/common/common.service';
import { AesEncryptDescryptService } from 'src/app/services/core/crypto-js/aes-encrypt-descrypt.service';
import { HttpWrapperService } from 'src/app/services/core/http-wrapper/http-wrapper.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { DecryptPipe } from './decrypt.pipe';

fdescribe('test decryption pipe', () => {
  let decServ: AesEncryptDescryptService;
  let provServ: ProfileService;
  let decryptPipe: DecryptPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        HttpWrapperService,
        SellerService,
        NgxImageCompressService,
        CommonService
      ]
    }).compileComponents();

    decryptPipe = new DecryptPipe();
  });

  fit('test created decryption pipe', () => {
    expect(decryptPipe).toBeDefined();
  });
});
