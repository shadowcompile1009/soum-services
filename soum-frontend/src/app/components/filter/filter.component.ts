import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { CommonService } from 'src/app/services/common/common.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { environment } from 'src/environments/environment';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { ProductSortBy } from 'src/app/components/filter/filter.types';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnDestroy {
  minValue: number;
  maxValue: number;
  options: Options = {
    floor: environment.filterMinRange,
    ceil: environment.filterMaxRange,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        // the return value is the same in the two cases.
        case LabelType.Low:
          return value + '<b>SAR</b>';
        case LabelType.High:
          return value + '<b>SAR</b>';
        default:
          return 'SAR' + value;
      }
    }
  };
  brands: any = [];
  models: Array<any> = [];
  category: any;
  capacities: Array<any> = [];
  grades: Array<any> = [];
  filterByCategory: FilterByCategory = new FilterByCategory();
  filterByModel: FilterByModel = new FilterByModel();
  modelCategory: string;
  subscriptions: Subscription[] = [];

  constructor(
    private _location: Location,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService
  ) {
    this.loadingSpecsToFilter();
  }

  loadingSpecsToFilter() {
    this.maxValue = environment.filterMaxRange;
    this.minValue = environment.filterMinRange;
    this.grades = [
      {
        value: 'excellent',
        name: 'soumCertification.excellent',
        class: 'excellent',
        selected: false
      },
      {
        value: 'good',
        name: 'soumCertification.good',
        class: 'great',
        selected: false
      },
      {
        value: 'fair',
        name: 'soumCertification.great',
        class: 'good',
        selected: false
      }
      // ,
      // {
      //   value: 'extensive',
      //   name: 'soumCertification.extensive',
      //   class: 'extensive',
      //   selected: false
      // }
    ];
    this.capacities = [
      {
        value: '64 GB',
        selected: false
      },
      {
        value: '128 GB',
        selected: false
      },
      {
        value: '256 GB',
        selected: false
      },
      {
        value: '512 GB',
        selected: false
      }
    ];
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
            if (
              this.filterByCategory &&
              this.filterByCategory.filterData &&
              this.filterByCategory.filterData.price &&
              this.category == savedData[storageKeys.filterByCategory].category
            ) {
              this.minValue = this.filterByCategory.filterData.price.from || 0;
              this.maxValue =
                this.filterByCategory.filterData.price.to ||
                environment.filterMaxRange;
            }
            this.capacities.forEach((c, index) => {
              let grade = this.filterByCategory.filterData.capacities.find(
                (gCheck) => {
                  return gCheck == c.value;
                }
              );
              if (grade) {
                this.capacities[index].selected = true;
              }
            });
            this.grades.forEach((g, index) => {
              let grade = this.filterByCategory.filterData.grade.find(
                (gCheck) => {
                  return gCheck == g.value;
                }
              );
              if (grade) {
                this.grades[index].selected = true;
              }
            });
          }
          this.getBrands(this.category);
        } else if (param && param.modelCategory) {
          this.modelCategory = param.modelCategory;
          if (
            savedData &&
            savedData[storageKeys.filterByModel] &&
            savedData[storageKeys.filterByModel].category == this.modelCategory
          ) {
            this.filterByModel = new FilterByModel(
              savedData[storageKeys.filterByModel]
            );
            if (
              this.filterByModel &&
              this.filterByModel.filterData &&
              this.filterByModel.filterData.price
            ) {
              this.minValue =
                this.filterByModel.filterData.price.from ||
                environment.filterMinRange;
              this.maxValue =
                this.filterByModel.filterData.price.to ||
                environment.filterMaxRange;
            }
            this.capacities.forEach((c, index) => {
              let capacity = this.filterByModel.filterData.capacities.find(
                (gCheck) => {
                  return gCheck == c.value;
                }
              );
              if (capacity) {
                this.capacities[index].selected = true;
              }
            });

            this.grades.forEach((g, index) => {
              let grade = this.filterByModel.filterData.grade.find((gCheck) => {
                return gCheck == g.value;
              });
              if (grade) {
                this.grades[index].selected = true;
              }
            });
          } else {
            this.minValue = environment.filterMinRange;
            this.maxValue = environment.filterMaxRange;
          }
        }
      })
    );
  }

  goBack() {
    this._location.back();
  }

  getBrands(category_id: string) {
    // getBrands & getModels have mostly the same code. Can you combine them?
    this.commonService.getBrands(category_id).subscribe(
      (res) => {
        if (res) {
          this.brands = res.brandList;
          this.brands.forEach((brand) => {
            if (
              this.filterByCategory &&
              this.filterByCategory.filterData &&
              this.filterByCategory.filterData.brand
            ) {
              let check = this.filterByCategory.filterData.brand.find(
                (_brand) => {
                  return _brand == brand.brand_id;
                }
              );
              if (check) {
                brand.selected = true;
                this.getModels(this.category, brand.brand_id);
              } else {
                brand.selected = false;
              }
            } else {
              brand.selected = false;
            }
          });
        } else {
          this.brands = [];
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  getModels(category_id: string, brand_id: string) {
    this.commonService.getModels(category_id, brand_id).subscribe(
      (res) => {
        if (res) {
          res.modelList.forEach((model) => {
            let check = this.models.find((_model) => {
              return _model._id == model._id;
            });
            if (!check) {
              this.models.push(model);
            }

            if (
              this.filterByCategory &&
              this.filterByCategory.filterData &&
              this.filterByCategory.filterData.model
            ) {
              let check2 = this.filterByCategory.filterData.model.find(
                (_model) => {
                  return _model == model._id;
                }
              );
              if (check2) {
                model.selected = true;
              } else {
                model.selected = false;
              }
            } else {
              model.selected = false;
            }
          });
        }
      },
      (error) => this.commonService.errorHandler(error)
    );
  }

  select(type: 'brand' | 'model', data: any) {
    switch (type) {
      case 'brand':
        data.selected = !data.selected;
        if (data.selected) {
          this.getModels(this.category, data.brand_id);
        } else {
          for (let i = this.models.length - 1; i >= 0; i--) {
            if (this.models[i].brand_id == data.brand_id) {
              this.models.splice(i, 1);
            }
          }
        }
        break;

      case 'model':
        data.selected = !data.selected;
        break;
    }
  }

  applyFilter() {
    firebase.analytics().logEvent('apply_filter');
    let selectedBrand = [];
    let capacities = [];
    this.capacities.forEach((c) => {
      if (c.selected) {
        capacities.push(c.value);
      }
    });
    let grades = [];
    this.grades.forEach((g) => {
      if (g.selected) {
        grades.push(g.value);
      }
    });
    this.brands.forEach((brand) => {
      if (brand.selected) {
        selectedBrand.push(brand.brand_id);
      }
    });

    let selectedModel = [];
    this.models.forEach((model) => {
      if (model.selected) {
        selectedModel.push(model._id);
      }
    });
    let filterData: any;
    if (this.category) {
      filterData = new FilterByCategory({
        category: this.category,
        filterData: {
          brand: selectedBrand,
          model: selectedModel,
          grade: grades,
          capacities: capacities,
          price: { from: this.minValue, to: this.maxValue },
          sort: ProductSortBy.DEFAULT
        }
      });
      this.storage.set(storageKeys.filterByCategory, filterData);
    } else {
      filterData = new FilterByModel({
        category: this.modelCategory,
        filterData: {
          grade: grades,
          capacities: capacities,
          price: { from: this.minValue, to: this.maxValue },
          sort: ProductSortBy.DEFAULT
        }
      });
      this.storage.set(storageKeys.filterByModel, filterData);
    }
    this._location.back();
  }

  clearFilter() {
    this.clear('capacities');
    this.brands.forEach((brand) => {
      brand.selected = false;
    });
    this.models.forEach((model) => {
      model.selected = false;
    });
    this.grades = [];
    this.capacities = [];
    this.minValue = environment.filterMinRange;
    this.maxValue = environment.filterMaxRange;

    // This code needs a disscussion in the next meeting

    if (this.filterByCategory && this.filterByCategory.filterData) {
      this.filterByCategory.filterData.model = [];
      this.filterByCategory.filterData.brand = [];
      this.filterByCategory.filterData.grade = [];
      if (this.filterByCategory.filterData.price) {
        this.filterByCategory.filterData.price.to = environment.filterMaxRange;
        this.filterByCategory.filterData.price.from =
          environment.filterMinRange;
      }
      this.storage.set(storageKeys.filterByCategory, this.filterByCategory);
    } else if (this.filterByModel && this.filterByModel.filterData) {
      this.filterByModel.filterData.model = [];
      this.filterByModel.filterData.brand = [];
      this.filterByModel.filterData.grade = [];
      if (this.filterByModel.filterData.price) {
        this.filterByModel.filterData.price.to = environment.filterMaxRange;
        this.filterByModel.filterData.price.from = environment.filterMinRange;
      }
      this.storage.set(storageKeys.filterByModel, this.filterByModel);
    } else {
      // implement part of code here
    }

    // function to clear filter
    this.loadingSpecsToFilter();
    this.clear('brand');
  }

  clear(type: 'brand' | 'model' | 'price' | 'grade' | 'capacities') {
    switch (type) {
      case 'brand':
        this.brands.forEach((brand) => {
          brand.selected = false;
        });
        this.models = [];
        if (this.filterByCategory && this.filterByCategory.filterData) {
          this.filterByCategory.filterData.brand = [];
          this.filterByCategory.filterData.model = [];
        } else if (this.filterByModel && this.filterByModel.filterData) {
          this.filterByModel.filterData.brand = [];
          this.filterByModel.filterData.model = [];
        }
        break;

      case 'model':
        this.models.forEach((model) => {
          model.selected = false;
        });
        if (this.filterByCategory && this.filterByCategory.filterData) {
          this.filterByCategory.filterData.model = [];
        } else if (this.filterByModel && this.filterByModel.filterData) {
          this.filterByModel.filterData.model = [];
        }
        break;

      case 'price':
        this.minValue = 0;
        this.maxValue = environment.filterMaxRange;
        if (this.filterByCategory && this.filterByCategory.filterData) {
          if (this.filterByCategory.filterData.price) {
            this.filterByCategory.filterData.price.to =
              environment.filterMaxRange;
            this.filterByCategory.filterData.price.from =
              environment.filterMinRange;
          }
        } else if (this.filterByModel && this.filterByModel.filterData) {
          if (this.filterByModel.filterData.price) {
            this.filterByModel.filterData.price.to = environment.filterMaxRange;
            this.filterByModel.filterData.price.from =
              environment.filterMinRange;
          }
        }
        break;

      case 'capacities':
        this.capacities.forEach((c, index) => {
          this.capacities[index].selected = false;
        });
        if (this.filterByCategory && this.filterByCategory.filterData) {
          this.filterByCategory.filterData.capacities = [];
          this.storage.set(storageKeys.filterByCategory, this.filterByCategory);
        } else if (this.filterByModel && this.filterByModel.filterData) {
          this.filterByModel.filterData.capacities = [];
          this.storage.set(storageKeys.filterByModel, this.filterByModel);
        }
        break;

      case 'grade':
        this.grades.forEach((g, index) => {
          this.grades[index].selected = false;
        });
        if (this.filterByCategory && this.filterByCategory.filterData) {
          this.filterByCategory.filterData.grade = [];
          this.storage.set(storageKeys.filterByCategory, this.filterByCategory);
        } else if (this.filterByModel && this.filterByModel.filterData) {
          this.filterByModel.filterData.grade = [];
          this.storage.set(storageKeys.filterByModel, this.filterByModel);
        }
        break;
    }
  }

  selectGrade(grade: any, index: number) {
    this.grades[index].selected = !grade.selected;
  }

  selectCapacity(capacity: any, index: number) {
    this.capacities[index].selected = !capacity.selected;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

export class FilterByCategory {
  category: string;
  filterData: Filter;

  constructor(data?: { category?: string; filterData?: Filter }) {
    if (data) {
      if (data.category) {
        this.setCategory(data.category);
      }
      if (data.filterData) {
        this.setFilterData(data.filterData);
      }
    }
  }

  setCategory(category: string) {
    this.category = category;
  }

  setFilterData(filterData: Filter) {
    this.filterData = {
      brand: filterData.brand || [],
      model: filterData.model || [],
      sort: filterData.sort || ProductSortBy.DEFAULT,
      capacities: filterData.capacities || [],
      grade: filterData.grade || [],
    };

    if (filterData.price && filterData.price.from > -1 && filterData.price.to) {
      this.filterData.price = {
        from: filterData.price.from,
        to: filterData.price.to
      };
    }
  }
}

export class FilterByModel {
  category: string;
  filterData: Filter;

  constructor(data?: { category: string; filterData?: Filter }) {
    if (data) {
      if (data.category) {
        this.setCategory(data.category);
      }
      if (data.filterData) {
        this.setFilterData(data.filterData);
      }
    }
  }

  setCategory(category: string) {
    this.category = category;
  }

  setFilterData(filterData: Filter) {
    this.filterData = {
      brand: filterData.brand || [],
      model: filterData.model || [],
      sort: filterData.sort || ProductSortBy.DEFAULT,
      capacities: filterData.capacities || [],
      grade: filterData.grade || []
    };

    if (filterData.price && filterData.price.from > -1 && filterData.price.to) {
      this.filterData.price = {
        from: filterData.price.from,
        to: filterData.price.to
      };
    }
  }
}

export interface Filter {
  brand?: Array<string>;
  model?: Array<string>;
  price?: { from: number; to: number };
  capacities?: Array<string>;
  grade?: Array<string>;
  sort?: ProductSortBy;
  page?: number;
  size?: number;
  userCity?: string;
}
