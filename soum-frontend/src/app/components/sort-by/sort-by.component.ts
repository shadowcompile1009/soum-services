import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { FilterByCategory, FilterByModel } from '../filter/filter.component';
import { ProductSortBy } from 'src/app/components/filter/filter.types';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss']
})
export class SortByComponent {
  public ProductSortBy: typeof ProductSortBy = ProductSortBy;
  selectedSorting: ProductSortBy = ProductSortBy.LOW_TO_HIGH;
  filterByCategory: FilterByCategory;
  filterByModel: FilterByModel;
  category: any;
  subscriptions: Subscription[] = [];

  constructor(
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService
  ) {
    const savedData = this.storage.getSavedData();
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((param) => {
        if (param && param.category) {
          this.category = param.category;
          if (
            savedData &&
            savedData[storageKeys.filterByCategory] &&
            savedData[storageKeys.filterByCategory].category
          ) {
            this.filterByCategory = new FilterByCategory(
              savedData[storageKeys.filterByCategory]
            );
            this.selectedSorting =
              this.filterByCategory.filterData.sort ||
              ProductSortBy.LOW_TO_HIGH;
          }
        } else {
          if (savedData && savedData[storageKeys.filterByModel]) {
            this.filterByModel = new FilterByModel(
              savedData[storageKeys.filterByModel]
            );
            this.selectedSorting =
              this.filterByModel.filterData.sort || ProductSortBy.LOW_TO_HIGH;
          }
        }
      })
    );
  }

  goBack() {
    this._location.back();
  }

  selectSorting(type: ProductSortBy) {
    this.selectedSorting = type;
  }

  applySort() {
    let filterData: any;
    if (this.category) {
      if (this.filterByCategory) {
        this.filterByCategory.filterData.sort =
          this.selectedSorting || ProductSortBy.DEFAULT;
        filterData = this.filterByCategory;
      } else {
        filterData = new FilterByCategory({
          category: this.category,
          filterData: {
            sort: this.selectedSorting || ProductSortBy.DEFAULT
          }
        });
      }
      this.storage.set(storageKeys.filterByCategory, filterData);
    } else {
      if (this.filterByModel) {
        this.filterByModel.filterData.sort =
          this.selectedSorting || ProductSortBy.DEFAULT;
        filterData = this.filterByModel;
      } else {
        filterData = new FilterByModel({
          category: '',
          filterData: {
            sort: this.selectedSorting || ProductSortBy.DEFAULT
          }
        });
      }
      this.storage.set(storageKeys.filterByModel, filterData);
    }
    this._location.back();
  }

  clearSort() {
    this.selectedSorting = ProductSortBy.DEFAULT;
    if (this.filterByCategory) {
      this.filterByCategory.filterData.sort = ProductSortBy.DEFAULT;
      this.storage.set(storageKeys.filterByCategory, this.filterByCategory);
    } else if (this.filterByModel) {
      this.filterByModel.filterData.sort = ProductSortBy.DEFAULT;
      this.storage.set(storageKeys.filterByModel, this.filterByModel);
    } else {
      //write your code here
    }

    this._location.back();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
