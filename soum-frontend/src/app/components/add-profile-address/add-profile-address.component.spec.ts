import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AddProfileAddressComponent } from './add-profile-address.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

fdescribe('AddProfileAddressComponent', () => {
  let component: AddProfileAddressComponent;
  let fixture: ComponentFixture<AddProfileAddressComponent>;

  interface UserDetails {
    address_id: {
      address: string;
      address_id: string;
      address_type: string;
      city: string;
      latitude: string;
      longitude: string;
      postal_code: string;
    };
    countryCode: string;
    mobileNumber: string;
    name: string;
    token: string;
    userId: string;
  }

  let userDetails: UserDetails = {
    address_id: {
      address: 'Cairo',
      address_id: '61b65d964b5da5f02cb6600f',
      address_type: '',
      city: 'Cairo',
      latitude: '',
      longitude: '',
      postal_code: '90242'
    },
    countryCode: '966',
    mobileNumber: '11111111113',
    name: 'Omar',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZGEwN2Y1M2JkZTUxMTg0M2M1OWNmNCIsImlhdCI6MTY0MjAwMjI1MywiZXhwIjoxNjQ0NTk0MjUzfQ.XodE7DLJB7bWpbLFMcXsOrounGcqE2m1V_dIgUMDT00',
    userId: '60da07f53bde511843c59cf4'
  };

  interface Address {
    address: string;
    address_id: string;
    address_type: string;
    city: string;
    latitude: string;
    longitude: string;
    postal_code: string;
  }

  let addres: Address = {
    address: 'Cairo',
    address_id: '61b65d964b5da5f02cb6600f',
    address_type: '',
    city: 'Cairo',
    latitude: '',
    longitude: '',
    postal_code: '90242'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProfileAddressComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        CommonService,
        SellerService,
        ProfileService,
        ModalService,
        TranslateService,
        NgxImageCompressService,
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProfileAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.userDetails = userDetails;
    component.address = addres;
    component.previousAddress = null;
  });

  fit('component add prfile should be create', () => {
    expect(component).toBeTruthy();
  });

  fit('check function to get userDetails', () => {
    component.getUserDetails();
    expect(component.userDetails).toBe(userDetails);
  });

  fit('check funtion to get addresses', () => {
    component.getAddressList();
    expect(component.address).toEqual(component.address);
  });

  fit('check cancel function to adding product', () => {
    component.cancel();
    expect(component.previousAddress).toBe(null);
  });
});
