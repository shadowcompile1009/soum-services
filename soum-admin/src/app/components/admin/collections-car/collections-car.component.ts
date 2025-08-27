import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { REGEX } from 'src/app/constants/regex';
import {
  CollectionsService,
  CollectionStatus,
} from 'src/app/services/collections/collections.service';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-collections',
  templateUrl: './collections-car.component.html',
  styleUrls: ['./collections-car.component.scss'],
})
export class CollectionsCarComponent implements OnInit {
  collectionsToBeReOrdered: Array<any> = [];
  userList: any;
  collectionList2: any;
  collectionList: any = [];

  activeCollectionsList: number;
  currentPage: number = 1;
  userToUpdate: any = {};
  updateUserForm: FormGroup;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  notMatchSearch: boolean = false;
  collectionType: string;
  collectionsTypes: any[] = [];
  HomepageActive: boolean = true;
  BannersActive: boolean;
  MPPActive: boolean;
  SPPActive: boolean;
  OffersActive: boolean;
  BudgetsActive: boolean;
  CarActive: boolean;

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private usersService: UsersService,
    private collectionsService: CollectionsService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('user_page_number')) || 1;
    this.updateUserForm = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.name),
        ])
      ),
    });
    this.getCollectionsTypes();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.collectionType = params['type'];
      if (this.collectionType) {
        this.getData(this.collectionType.toLowerCase());
      } else {
        this.getCollectionsList();
      }
    });
  }

  getCollectionsTypes() {
    this.commonService.presentSpinner();
    this.collectionsService.getCollectionsTypes().subscribe(
      (response) => {
        this.commonService.dismissSpinner();
        this.collectionsTypes = response.body.responseData;
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  getCollectionsList() {
    this.commonService.presentSpinner();
    this.notMatchSearch = false;
    this.collectionsService.getCollectionList('cars').subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        this.collectionList = res.body.responseData;
        this.activeCollectionsList = this.collectionList.filter(
          (item) => item.collectionStatus === 1
        ).length;
        this.notMatchSearch =
          this.userList && this.userList.length < 1 ? true : false;

        this.collectionList.forEach((collection) => {
          collection.checkStatus =
            collection.collectionStatus == 'Active' ? true : false;
        });
      },
      (error) => {
        this.collectionList = [];
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  getCollectionsTypeList(feedType: string) {
    this.commonService.presentSpinner();
    this.notMatchSearch = false;
    this.collectionsService.getCollectionsTypeList(feedType,'cars').subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        this.collectionList = res.body.responseData;
        this.activeCollectionsList = this.collectionList.filter(
          (item) => item.collectionStatus === 1
        ).length;
        this.notMatchSearch =
          this.userList && this.userList.length < 1 ? true : false;

        this.collectionList.forEach((collection) => {
          collection.checkStatus =
            collection.collectionStatus == 'Active' ? true : false;
        });
      },
      (error) => {
        this.collectionList = [];
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  getData(activeTab: string) {
    this.router.navigate(['/admin/collections-car'], {
      queryParams: { type: activeTab },
    });
    switch (activeTab) {
      case 'homepage':
        this.HomepageActive = true;
        this.BannersActive = false;
        this.MPPActive = false;
        this.SPPActive = false;
        this.OffersActive = false;
        this.BudgetsActive = false;
        this.getCollectionsTypeList(activeTab);
        break;
      case 'mpp':
        this.HomepageActive = false;
        this.BannersActive = false;
        this.MPPActive = true;
        this.SPPActive = false;
        this.OffersActive = false;
        this.BudgetsActive = false;
        this.getCollectionsTypeList(activeTab);
        break;
      case 'spp':
        this.HomepageActive = false;
        this.BannersActive = false;
        this.MPPActive = false;
        this.SPPActive = true;
        this.OffersActive = false;
        this.BudgetsActive = false;
        this.getCollectionsTypeList(activeTab);
        break;
      case 'banner':
        this.HomepageActive = false;
        this.BannersActive = true;
        this.MPPActive = false;
        this.SPPActive = false;
        this.OffersActive = false;
        this.BudgetsActive = false;
        this.getCollectionsTypeList(activeTab);
        break;
      case 'offers':
        this.HomepageActive = false;
        this.BannersActive = false;
        this.MPPActive = false;
        this.SPPActive = false;
        this.OffersActive = true;
        this.BudgetsActive = false;
        this.getCollectionsTypeList(activeTab);
        break;
      case 'Offers':
        this.HomepageActive = false;
        this.BannersActive = false;
        this.MPPActive = false;
        this.SPPActive = false;
        this.OffersActive = true;
        this.BudgetsActive = false;
        this.getCollectionsTypeList(activeTab);
        break;
      case 'budget':
        this.HomepageActive = false;
        this.BannersActive = false;
        this.MPPActive = false;
        this.SPPActive = false;
        this.OffersActive = false;
        this.BudgetsActive = true;
        this.getCollectionsTypeList(activeTab);
        break;
      default:
        this.HomepageActive = false;
        this.BannersActive = false;
        this.MPPActive = false;
        this.SPPActive = false;
        this.OffersActive = false;
        break;
    }
  }

  selectPage(event) {
    this.currentPage = event;
    this.getCollectionsList();
    localStorage.setItem('user_page_number', event);
  }

  changeCollectionStatus(collection: any) {
    this.commonService.presentSpinner();
    this.collectionsService
      .handleCollectionStatus({
        feedId: collection.id,
        status: collection.collectionStatus ? 1 : 0,
        feedType: this.HomepageActive
          ? 'Homepage'
          : this.MPPActive
          ? 'MPP'
          : this.BannersActive
          ? 'banner'
          : this.OffersActive
          ? 'offers'
          : this.BudgetsActive
          ? 'budget'
          : 'SPP',
      })
      .subscribe(
        () => {
          this.commonService.dismissSpinner();
          collection.checkStatus !== collection.checkStatus;
          if (this.HomepageActive) {
            this.getCollectionsList();
          } else if (this.MPPActive) {
            this.getCollectionsTypeList('mpp');
          } else if (this.BannersActive) {
            this.getCollectionsTypeList('banner');
          } else if (this.OffersActive) {
            this.getCollectionsTypeList('offers');
          } else if (this.BudgetsActive) {
            this.getCollectionsTypeList('budget');
          } else {
            this.getCollectionsTypeList('spp');
          }
        },
        (error) => {
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
        this.getCollectionsList();
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  getCollectionDetails(collection_id: string) {
    this.router.navigate(['/admin/collections-car', collection_id], {
      queryParams: {
        type: this.HomepageActive
          ? 'Homepage'
          : this.MPPActive
          ? 'MPP'
          : this.BannersActive
          ? 'banner'
          : this.OffersActive
          ? 'offers'
          : this.BudgetsActive
          ? 'budget'
          : 'SPP',
      },
    });
  }

  addCollection() {
    if (
      !this.HomepageActive &&
      !this.MPPActive &&
      !this.SPPActive &&
      !this.BannersActive &&
      !this.OffersActive &&
      !this.BudgetsActive
    ) {
      this.router.navigate(['/admin/collections-car', 'add']);
    } else {
      this.router.navigate(['/admin/collections-car', 'add'], {
        queryParams: {
          type: this.HomepageActive
            ? 'Homepage'
            : this.MPPActive
            ? 'MPP'
            : this.BannersActive
            ? 'banner'
            : this.OffersActive
            ? 'offers'
            : this.BudgetsActive
            ? 'budget'
            : 'SPP',
        },
      });
    }
  }

  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this collection?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        // delete collection here
        this.commonService.presentSpinner();
        this.collectionsService
          .handleCollectionStatus({ feedId: id, status: 2 })
          .subscribe(
            () => {
              this.commonService.dismissSpinner();
              if (this.collectionType) {
                this.getData(this.collectionType.toLowerCase());
              } else {
                this.getCollectionsList();
              }
            },
            (error) => {
              this.commonService.dismissSpinner();
              this.commonService.errorToast(error.error.message);
            }
          );
      }
    });
  }
  pre: any;
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.collectionsToBeReOrdered,
      event.previousIndex,
      event.currentIndex
    );
    this.pre = JSON.stringify(this.collectionsToBeReOrdered, null, ' ');
  }

  getcollectionsToBeReOrdered() {
    this.collectionsToBeReOrdered = [];
    this.collectionList.forEach((collection) => {
      this.collectionsToBeReOrdered.push({ ...collection });
    });
  }

  changeOrderForCollection() {
    let payload = {
      collectionIds: [],
    };
    this.collectionsToBeReOrdered.forEach((collection) => {
      payload.collectionIds.push(collection.id);
    });
    if (!payload.collectionIds.length) {
      return;
    }
    this.collectionsToBeReOrdered = [];
    this.commonService.presentSpinner();
    this.collectionsService.changeOrderForCollection(payload).subscribe(
      (res) => {
        if (res) {
          this.collectionsToBeReOrdered = [];
          this.commonService.dismissSpinner();
          this.getCollectionsTypeList(this.collectionType.toLowerCase());
        }
      },
      (error) => {
        this.collectionsToBeReOrdered = [];
        this.commonService.errorHandler(error);
      }
    );
  }
}
