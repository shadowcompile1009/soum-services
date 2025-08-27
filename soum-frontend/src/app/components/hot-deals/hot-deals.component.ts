import { CommonService } from './../../services/common/common.service';
import { Product } from './../../shared-components/product-model/product-model.interface';
import { HotDeals, HotDealsId } from './hot-deals.types';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiEndpoints } from 'src/app/services/core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from 'src/app/services/core/http-wrapper/http-wrapper.service';
import { Subscription } from 'rxjs';
import { GetHotDealsDTO } from 'src/app/components/hot-deals/hot-deals.dto';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hot-deals',
  templateUrl: './hot-deals.component.html',
  styleUrls: ['./hot-deals.component.scss']
})
export class HotDealsComponent implements OnInit {
  @Input('heroSection') heroSection: boolean = false;
  @Input('product') product: Partial<Product>;

  public hotDeals: HotDeals = null;

  constructor(
    private router: Router,
    private httpService: HttpWrapperService,
    private commonService: CommonService,
    private location: Location,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.commonService.observableSett.subscribe((settings) => {
      if (settings?.hot_deals) {
        this.getHotDeals(settings?.hot_deals);
      }
    });
  }

  async getHotDeals(hotDealsId: HotDealsId): Promise<Subscription> {
    return await this.httpService
      .getV2(ApiEndpoints.getHotDealsv2(hotDealsId))
      .subscribe(({ responseData }: GetHotDealsDTO) => {
        if (responseData?.items?.length) {
          this.hotDeals = responseData;
        }
      });
  }

  navigateBack() {
    this.location.back();
  }

  navigateToAllHotDeals() {
    this.router.navigate(['/hot-deals']);
  }

  ngOnDestroy(): void {}
}
