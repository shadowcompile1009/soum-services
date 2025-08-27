import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { REGEX } from 'src/app/constants/regex';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommissionsService } from 'src/app/services/commissions/commissions.service';
declare var $: any;
@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']

})
export class CommissionsComponent implements OnInit {
  typeText ='';
  collectionsToBeReOrdered: Array<any> = [];
  items =[];
  checkbox = true;
  userList: any;
  collectionList2: any;
  collectionList: any = [
  ];
  buyerCommissionRanges = false;
  userType = '';
  sellerTypes =[];
  CommissionForm: FormGroup;
  formData: FormData = new FormData();
  CommissionFormBuyer: FormGroup
buyerCommission;
  activeCollectionsList: number;
  currentPage: number = 1;
  userToUpdate: any = {};
  updateUserForm: FormGroup;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  notMatchSearch: boolean = false;
  collectionType: string;
  collectionsTypes: any[] = [];
  HomepageActive: boolean = false;
  MPPActive: boolean = true;
  SPPActive: boolean;
 showBuyerCommission = false;
 commissionList =[];
 showActivity = false;
 buyer = true;
  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private usersService: UsersService,
    private commissionService: CommissionsService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder
  ) { }
  getComissionsList() {

    this.commonService.presentSpinner();
    this.commissionService
      .getCommissionList()
      .subscribe(
        (res) => {  
            this.commissionList = res.body.data;
            this.commonService.dismissSpinner();
          }
        ,
        (error) => {
          this.commissionList = [];
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }
  get options() : FormArray {
    return this.CommissionForm.get("options") as FormArray
  }
  removeOption(index: number) {
    this.options.removeAt(index);
  }
  navigateToLog(){
    this.router.navigate(['/admin/commissions/activityLog']);
  }
  saveAttribute(){}
  addOption() {
   this.options.push(this.fb.group({
    'id': [null],
     'userType':[''],
     'isBuyer':[''],
     'type':[''],
     'ranges':{
      'fairPercentage':[0],
      'excellentPercentage':[0],
      'expensivePercentage':[0],
     },

    'minimum': [0],
    'percentage': [0],
    'maximum': [0],
    'status': [false],
      }));
  }
  ngOnInit(): void {
    this.getComissionsList();
    this.CommissionFormBuyer = this.fb.group({
      'fairPercentage':[0, Validators.required],
      'excellentPercentage':[0, Validators.required],
      'expensivePercentage':[0, Validators.required],
  });
    this.CommissionForm = this.fb.group({
      'id': [null],
      'options': this.fb.array([])
    })
    this.updateUserForm = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.name),
        ])
      ),
    });
    this.getCommissionsTypes();
  }

  addCommissionFinal(){

  if(this.CommissionFormBuyer.value.excellentPercentage !== 0){
      const obj =
      {
        "userType":this.userType,
        "isBuyer": true,
        "type": 'PriceQuality',
        "ranges": {
          "fairPercentage": this.CommissionFormBuyer.value.fairPercentage,
          "excellentPercentage": this.CommissionFormBuyer.value.excellentPercentage,
          "expensivePercentage": this.CommissionFormBuyer.value.expensivePercentage
        },
       
        "status": 'Active',
        "name": "test"
      }
    this.commissionService.addCommission(obj).subscribe(response => {
      this.commonService.dismissSpinner();

     // this.collectionsTypes = response.body.responseData;
    }, error => {
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(error);
    });  
  }
    for(let item of this.options.value){
      const obj =
      {
        "userType":this.userType,
        "isBuyer":  this.showBuyerCommission,
        "type": item.type,
        "ranges": {
          "fairPercentage": 0,
          "excellentPercentage": 0,
          "expensivePercentage": 0
        },
        "minimum": item?.type == 'Fixed' ? item.maximum : item.minimum,
        "maximum": item.maximum,
        "percentage": item.percentage ,
        "status": item.status === false ? 'Inactive' :'Active',
        "name": "test"
      }
    this.commissionService.addCommission(obj).subscribe(response => {
      this.commonService.dismissSpinner();
     // this.collectionsTypes = response.body.responseData;
    }, error => {
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(error);
    });
    }
    setTimeout(() => {
      this.CommissionForm.reset();
      this.CommissionFormBuyer.reset();
      this.getcommission();
      this.getComissionsList();
    }, 3000);
  }
  

  getCommissionsTypes() {
 

    this.commonService.presentSpinner();
    this.commissionService.getSellerArrayTypes().subscribe(response => {
      this.commonService.dismissSpinner();
      this.sellerTypes = response.body;
      this.userType = this.sellerTypes[0].key
      this.getcommission();
    }, error => {
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(error);
    });
  }
  getData(activeTab: string) {

    switch (activeTab) {
      case 'buyer':

        this.HomepageActive = true;
        this.MPPActive = false;
        this.SPPActive = false;
        this.showBuyerCommission = true;
        this.getcommission();
        this.getComissionsList();
        break;
      case 'seller':
        this.showBuyerCommission = false;
        this.HomepageActive = false;
        this.MPPActive = true;
        this.SPPActive = false;
        this.getcommission();
        this.getComissionsList();
        break;

      default:
        this.HomepageActive = false;
        this.MPPActive = false;
        this.showBuyerCommission = false;

        this.SPPActive = false;
        this.getcommission();
        this.getComissionsList();

        break;
    }
  }
  selectchange(name){
    this.userType = name;
    this.getcommission();
  }
  getcommission(){
    this.commonService.presentSpinner();

    this.commissionService.getCommissions( this.showBuyerCommission , this.userType).subscribe(response => {
      this.commonService.dismissSpinner();
      this.buyerCommissionRanges = false;
      this.items = response.body.items;
      for(let i =0 ; i< this.items.length ; i++){
        if(this.items[i].status == 'Active' ){
          this.items[i].check = true;
        }
        else{
          this.items[i].check = false;     
        }
        if(this.items[i]?.ranges?.fairPercentage !== 0){
  this.buyerCommissionRanges = true;
  this.buyerCommission = this.items[i];
        }
      }

    }, error => {
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(error);
    });
  }
  selectPage(event) {
    this.currentPage = event;
 //   this.getCollectionsList();
    localStorage.setItem('user_page_number', event);
  }

  changeUserStatus(collection: any) {
    this.commonService.presentSpinner();
    this.commissionService.handleCollectionStatus({ feedId: collection.id, status: collection.collectionStatus ? 1 : 0, feedType: this.HomepageActive ? 'Homepage' : this.MPPActive ? 'MPP' : 'SPP' }).subscribe(() => {
      this.commonService.dismissSpinner();
      collection.checkStatus !== collection.checkStatus;
      if (this.HomepageActive) {
       // this.getCollectionsList();

      } else if (this.MPPActive) {
     //   this.getCollectionsTypeList('mpp')
      } else {
      //  this.getCollectionsTypeList('spp')
      }
    }, (error) => {
      this.commonService.dismissSpinner();
      this.commonService.errorToast(error.error.message);
    }
    );

  }

  deleteUser(user: any) {
    this.commonService.presentSpinner();
    this.usersService.deleteUser(user._id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
      //  this.getCollectionsList();
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  getCollectionDetails(collection_id: string) {
    this.router.navigate(['/admin/collections', collection_id], {
      queryParams: { type: this.HomepageActive ? 'Homepage' : this.MPPActive ? 'MPP' : 'SPP' },
    });
  }

  addCollection() {
    if (!this.HomepageActive && !this.MPPActive && !this.SPPActive) {
      this.router.navigate(['/admin/collections', 'add']);
    } else {
      this.router.navigate(['/admin/collections', 'add'], {
        queryParams: { type: this.HomepageActive ? 'Homepage' : this.MPPActive ? 'MPP' : 'SPP' },
      });
    }
  }
save(item){
  let options = {
    title: 'Are you Sure you want to save this commission?',
    confirmLabel: 'Okay',
    declineLabel: 'Cancel',
  };
  if(item.check == true){
    item.status = 'Active';
  }
  if(item.check == false){
    item.status = 'Inactive';
  }
  this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
    if (res) {

      this.commonService.presentSpinner();
      this.commissionService.saveCommission(item).subscribe(() => {
        this.commonService.dismissSpinner();

          this.getcommission();

      },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorToast(error.error.message);
        }
      );

    }
  });
}
  delete(id) {
    let options = {
      title: 'Are you Sure you want to delete this commission?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        // delete collection here
        this.commonService.presentSpinner();
        this.commissionService.handleDeleteoption(id).subscribe(() => {
          this.commonService.dismissSpinner();

            this.getcommission();

        },
          (error) => {
            this.commonService.dismissSpinner();
            this.commonService.errorToast(error.error.message);
          }
        );

      }
    });
  }
  pre: any
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.collectionsToBeReOrdered, event.previousIndex, event.currentIndex);
    this.pre = JSON.stringify(this.collectionsToBeReOrdered, null, ' ');
  }

  getcollectionsToBeReOrdered() {
    this.collectionsToBeReOrdered = []
    this.collectionList.forEach(
      (collection) => {
        this.collectionsToBeReOrdered.push({ ...collection })
      }
    )
  }

  changeOrderForCollection() {
    let payload = {
      "collectionIds": []
    }
    this.collectionsToBeReOrdered.forEach(
      (collection) => {
        payload.collectionIds.push(collection.id);
      }
    );
    if (!payload.collectionIds.length) {
      return;
    }
    this.collectionsToBeReOrdered = [];
    this.commonService.presentSpinner();
    this.commissionService.changeOrderForCollection(payload).subscribe(
      (res) => {
        if (res) {
          this.collectionsToBeReOrdered = [];
          this.commonService.dismissSpinner();
         // this.getCollectionsList();
        }
      },
      (error) => {
        this.collectionsToBeReOrdered = [];
        this.commonService.errorHandler(error);
      }
    )
  }
}
