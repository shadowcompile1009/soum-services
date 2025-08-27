import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  user: any;
  bidEntries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  sellEntries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  sellPageLimit: number = 10;
  sellCurrentPage: number = 1;

  bidPageLimit: number = 10;
  bidCurrentPage: number = 1;
  biddingList: any[];
  showDecrypt =true;
  showDecryptBIC = true;
  userId: any;
  userAddress: any;
  constructor(
    private router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private commonService: CommonService
  ) {
    let state = this.router.getCurrentNavigation().extras.state;
    // if (state && state.user) {
    //   this.user = state.user;
    //   this.sellEntries = this.commonService.calculateEntries(
    //     this.user.sellProductList,
    //     this.sellCurrentPage,
    //     this.sellPageLimit,
    //     this.user.sellProductList.length
    //   );
    //   this.bidEntries = this.commonService.calculateEntries(
    //     this.user.bidProductList,
    //     this.bidCurrentPage,
    //     this.bidPageLimit,
    //     this.user.bidProductList.length
    //   );
    // }
    //  else {
      this.activatedRoute.params.subscribe((params) => {
        this.userId = params.user_id;
        this.getUserDetails(params.user_id);
        this.getUserAddress();
      });
    // }
  }

  ngOnInit(): void {}

  getUserDetails(user_id: string) {
    this.commonService.presentSpinner();
    this.userService.getUserDetail(user_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res && res.body) {
          this.user = res.body.userData;
          if(this.user?.bankDetail?.accountId?.startsWith("SA") || this.user?.bankDetail?.accountId?.startsWith("sa")){
            this.showDecrypt = false;
          }
          if(!this.user?.bankDetail?.accountId?.startsWith("SA") || !this.user?.bankDetail?.accountId?.startsWith("sa"))
          {
            this.showDecrypt = true;
          }
          if(this.user?.bankDetail?.accountId?.includes("+")){

            this.showDecryptBIC = false;
          }
          this.sellEntries = this.commonService.calculateEntries(
            this.user.sellProductList,
            this.sellCurrentPage,
            this.sellPageLimit,
            this.user.sellProductList.length
          );
          this.bidEntries = this.commonService.calculateEntries(
            this.user?.bidProductList,
            this.bidCurrentPage,
            this.bidPageLimit,
            this.user?.bidProductList?.length || 0
          );
        } else {
          this._location.back();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this._location.back();
        this.commonService.errorHandler(error);
      }
    );
  }

  getUserAddress() {
    console.log("USER ID", this.userId);
    this.commonService.getAddressFromV2(this.userId).subscribe((data) => {
      const addresses = data.body.responseData;
      this.userAddress = addresses.length>0 ? addresses[addresses.length - 1] : []
    }, err => {
      this.commonService.errorHandler(err);
    })
  }

  selectPage(type: 'sell' | 'bid', event) {
    switch (type) {
      case 'sell':
        this.sellCurrentPage = event;
        this.sellEntries = this.commonService.calculateEntries(
          this.user.sellProductList,
          this.sellCurrentPage,
          this.sellPageLimit,
          this.user.sellProductList.length
        );
        break;

      case 'bid':
        this.bidCurrentPage = event;
        this.bidEntries = this.commonService.calculateEntries(
          this.user?.bidProductList,
          this.bidCurrentPage,
          this.bidPageLimit,
          this.user?.bidProductList?.length || 0
        );
        break;
    }
  }

  check(event) {
    console.log(event);
  }

  showAllBids(biddingList: Array<any>) {
    this.biddingList = biddingList;
  }

  // function to back the recent page
  // added by @naeeim 15/6/2021
  goBack() {
    this._location.back();
  }
}
