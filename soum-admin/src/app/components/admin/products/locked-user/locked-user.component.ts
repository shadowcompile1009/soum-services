import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../../services/common/common.service';
import { ProductsService } from '../../../../services/products/products.service';
import { UsersService } from '../../../../services/users/users.service';


@Component({
  selector: 'app-locked-user',
  templateUrl: './locked-user.component.html',
  styleUrls: ['./locked-user.component.scss'],
})
export class LockedUserComponent implements OnInit {
  constructor(
    private matDialogeRef: MatDialogRef<LockedUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductsService,
    private userService: UsersService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {}

  closeLockedUserDialoge() {
    this.matDialogeRef.close();
  }

  blockUserByID() {
    this.commonService.presentSpinner();
    this.userService.changeUserStatus(this.data.userID, this.data.blockUser).subscribe(res => {
      this.productService.loadFrontLiners.next(true);
      this.commonService.dismissSpinner();
    }, err => {
      this.commonService.dismissSpinner();
      console.log('error from block user --> ', err)
    })
    this.matDialogeRef.close();
  }
}
