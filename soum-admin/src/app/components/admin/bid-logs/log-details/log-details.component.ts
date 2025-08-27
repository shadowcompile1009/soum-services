import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';

export interface ILogDetails {
  amount: number;
  buyerName: string;
  createdAt: string;
  expiresAt: string;
  id: string;
  productId: string;
  productName: string;
  productNameAr: string;
  sellerId: string;
  sellerName: string;
  status: string;
  statusId: string;
  transaction: string;
  updatedAt: string;
  startBid: string;
  userId: string;
}

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss'],
})
export class LogDetailsComponent implements OnInit {
  logDetails: ILogDetails;

  constructor(
    public dialogeRef: MatDialogRef<LogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public translate: TranslateService,
    private commonService: CommonService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getBidLogDetails();
  }

  getBidLogDetails() {
    this.commonService.presentSpinner();
    this.usersService.getBidLogDetails(this.data.id).subscribe(
      (res) => {
        this.logDetails = res.body;
        this.commonService.dismissSpinner();
      },
      (error) => {
        this.commonService.errorHandler(error);
        this.commonService.dismissSpinner();
      }
    );
  }

  close() {
    this.dialogeRef.close();
  }
}
