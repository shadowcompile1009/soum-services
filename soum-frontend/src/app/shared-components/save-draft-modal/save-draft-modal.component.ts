import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { CommonService } from 'src/app/services/common/common.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-save-draft-modal',
  templateUrl: './save-draft-modal.component.html',
  styleUrls: ['./save-draft-modal.component.scss']
})
export class SaveDraftModalComponent implements OnInit {
  showModal = true;
  questions = [];
  isUpdatedRes = false;
  productId: string;
  empty: boolean = false;

  constructor(
    private eventService: EventsService,
    private commonService: CommonService,
    private sellerService: SellerService,
    private homeService: HomeService,
    private router: Router
  ) {
    this.sellerService.observableLoading.subscribe((ques) => {
      this.questions = ques;
    });
  }

  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }

  onSaveAnswerQuestionnaire(productId: string) {
    if (this.questions?.length > 0 && productId) {
      const obj = {
        product_id: productId,
        responses: this.questions
      };
      this.sellerService.postAnswersToProduct(obj).subscribe((res) => {
        this.empty = true;
      });
      if (this.sellerService.savedResponseId) {
        this.sellerService
          .deleteAnswersToProduct(this.sellerService.savedResponseId)
          .subscribe((res) => {
            this.empty = true;
          });
      }
    }
  }

  onSaveAsDraft() {
    const currentStepRoute = this.router.url.split('?')[0];
    this.sellerService.uploadProductData.save_as_draft_step =
      currentStepRoute || '';
    this.commonService.presentSpinner();
    this.removeOldProduct();
    this.sellerService.saveAsDraftProduct().then(async (res) => {
      this.commonService.dismissSpinner();
      if (res) {
        const productId = res.responseData._id || null;
        if (
          currentStepRoute === '/question-answer' ||
          currentStepRoute === '/product-price' ||
          currentStepRoute === '/pick-up-address'
        ) {
          await this.onSaveAnswerQuestionnaire(productId);
        }
        localStorage.removeItem('selectedBrand');
        localStorage.removeItem('selectedDevice');
        localStorage.removeItem('selectedModel');
        localStorage.removeItem('selectedVarient');
        localStorage.removeItem('productIDForDraft');
        this.sellerService.nullifyVariables();
        this.router.navigate(['/save-draft']);
      } else {
        //write your code here
      }
    });
  }

  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.onSaveAsDraftModal, (data: any) => {
      this.showModal = true;
    });
  }

  hideSaveAsDraftComfirmModal() {
    this.showModal = false;
  }

  removeOldProduct() {
    const productId = this.sellerService.selectedProductId;
    if (productId) {
      this.homeService.deleteProduct(productId).subscribe(
        (res) => {
          this.empty = true;
        },
        (error) => {
          this.commonService.errorHandler(error, true);
        }
      );
    }
  }
}
