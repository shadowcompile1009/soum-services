import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-last-step-listing',
  templateUrl: './last-step-listing.component.html',
  styleUrls: ['./last-step-listing.component.scss']
})
export class LastStepListingComponent {
  showEnglish = false;
  showArabic = false;
  productID: any;
  constructor(private router: Router, private translate: TranslateService) {
    var lang = this.translate.getDefaultLang();
    if (lang == 'en') {
      this.showEnglish = true;
      this.showArabic = false;
    }
    if (lang == 'ar') {
      this.showEnglish = false;
      this.showArabic = true;
    }
    this.translate = translate;
    this.productID = localStorage.getItem('productIDCon');
  }

  navigateToProduct() {
    this.router.navigate(['/product-detail'], {
      queryParams: { product: this.productID }
    });
  }
}
