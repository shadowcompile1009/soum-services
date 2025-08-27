import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsService } from '../../../../services/products/products.service';
import { CommonService } from '../../../../services/common/common.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
@Component({
  selector: 'app-delete-listing-comment-popup',
  templateUrl: './delete-listing-comment-popup.component.html',
  styleUrls: ['./delete-listing-comment-popup.component.scss']
})
export class DeleteListingCommentPopupComponent implements OnInit {
  deleteListingComment: any = '';
  pageURL: string = '';
  toggleDropdown: boolean = false;
  selectedReason: any = '';
  dropDown: any = '';

  constructor(
    public dialogeRef: MatDialogRef<DeleteListingCommentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public productData: any,
    private productService: ProductsService,
    private commonService: CommonService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.pageURL = this.router.url;
    this.dropDown = document.getElementById('dropdownReason');
  }

  showReasonDropDown() {
    this.toggleDropdown = !this.toggleDropdown;
    this.dropDown.style.display= this.toggleDropdown ? 'inline' : 'none';
  }

  setSelectedReason(reason:string) {
    this.selectedReason = reason;
    this.deleteListingComment = reason !== "Other" ? reason : '';
    this.showReasonDropDown();
  }

  deleteListingAndSendFeedback() {
    this.commonService.presentSpinner();
    this.productService.deleteOrRejectListingProduct(this.productData.productID, this.productData.actionType, this.deleteListingComment).subscribe(res => {
      if(this.productData.actionType === 'delete') {
        this.commonService.successToaster('Listing deleted successfully');
      } else {
        this.commonService.errorToast('Listing Rejected successfully');
      }
      this.dialogeRef.close();
      setTimeout(() => {
        this.commonService.dismissSpinner();
        if(this.pageURL.includes('products-details')){
          this.location.back();
        }else{
          this.productService.loadFrontLiners.next(true);
        }
      }, 1200);
    }, err => {
      this.commonService.dismissSpinner();
      this.commonService.errorToast('Something went wrong');
    } )
  }

  closeModal() {
    this.dialogeRef.close();
  }
}
