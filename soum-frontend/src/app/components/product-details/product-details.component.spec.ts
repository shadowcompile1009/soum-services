// import { HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { ActivatedRoute } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { NgxImageCompressService } from 'ngx-image-compress';
// import { CommonService } from 'src/app/services/common/common.service';
// import { HomeService } from 'src/app/services/home/home.service';
// import { ProductDetailsComponent } from './product-details.component';

// fdescribe('ProductDetailsComponent', () => {
//   let component: ProductDetailsComponent;
//   let fixture: ComponentFixture<ProductDetailsComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ ProductDetailsComponent ],
//       imports: [HttpClientModule, MatDialogModule, RouterTestingModule, TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useClass: TranslateFakeLoader
//           }
//       })],
//       providers: [CommonService,HomeService,NgxImageCompressService,{provide: ActivatedRoute, useValue: {}},{provide: MatDialogRef, useValue: {}}]
//     })
//     .compileComponents();
//     fixture = TestBed.createComponent(ProductDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
