import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {MatDialog} from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './components/admin/admin.module';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxBootstrapConfirmModule } from 'ngx-bootstrap-confirm';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ApiService } from './services/api.service';
import { HttpInterceptorService } from './services/core/http-interceptor/http-interceptor.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PipesModule } from './pipes/pipes.module';
import { OwlModule } from 'ngx-owl-carousel';

import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as Sentry from '@sentry/angular';
import {ProductImagesComponent} from './components/admin/products/products-details/products-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from  'ng-otp-input';
import { TruncatePipe } from './pipes/truncate.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({


  declarations: [AppComponent, LoginComponent, ForgotPasswordComponent , ProductImagesComponent],
  imports: [
    CommonModule,
    NgxBootstrapConfirmModule,
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    NgApexchartsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    OwlModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
    }),
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    DragDropModule,
    PipesModule,
    NgbModule,
    NgOtpInputModule,
    DlDateTimeDateModule,
    DlDateTimePickerModule
  ],
  providers: [

    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    TitleCasePipe,
    TruncatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
