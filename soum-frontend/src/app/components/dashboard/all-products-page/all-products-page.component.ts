import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CommonService,
  BuyModalPrice
} from 'src/app/services/common/common.service';

@Component({
  selector: 'app-all-products-page',
  templateUrl: './all-products-page.component.html',
  styleUrls: ['./all-products-page.component.scss']
})
export class AllProductsPageComponent {
  @Input() product;
  @Output() nagvigate = new EventEmitter();
  @Output() favoriteEmitter = new EventEmitter();
  translate: TranslateService;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private injector: Injector
  ) {
    this.translate = this.injector.get<TranslateService>(TranslateService);
  }
  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }
  checkGrade(grade) {
    if (grade) {
      if (grade.includes('Like New')) {
        return 'excellent';
      }
      if (grade.includes('Lightly Used')) {
        return 'great';
      }
      if (grade.includes('Fair')) {
        return 'good';
      }
      if (grade.includes('Extensive Use')) {
        return 'extensive';
      }
    }
  }

  navigateTo(route: string, product: any) {
    this.nagvigate.emit(route);
  }

  favorite(product) {
    this.favoriteEmitter.emit(product);
  }
}
