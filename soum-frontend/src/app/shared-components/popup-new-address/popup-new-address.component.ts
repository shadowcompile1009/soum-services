import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-popup-new-address',
  templateUrl: './popup-new-address.component.html',
  styleUrls: ['./popup-new-address.component.scss']
})
export class PopupNewAddressComponent implements OnInit {
  order: string;
  checkStatusUserAddress: any;
  NewAddressUser: boolean = true;
  oldUserAddress: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialoage: MatDialogRef<PopupNewAddressComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.checkUserAddressStatus();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order = params.order;
    });
  }

  // check user have new address || old address || not have address
  checkUserAddressStatus() {
    const addressUserInfo = this.commonService.checkUserAddressStatus();
    this.oldUserAddress = addressUserInfo?.userHaveOldAddress || false;
    this.NewAddressUser = addressUserInfo?.userHaveNewAddress || false;
  }

  closePopupAddress() {
    this.dialoage.close();
  }

  redirectToUpdateAddress() {
    const closeInSamePage = this.data ? this.data.closeInSamePage : false;
    if (closeInSamePage) {
      this.dialoage.close();
      return;
    }
    this.dialoage.close();
    this.router.navigate(['/add-address'], { state: { updateAddress: true } });
  }
}
