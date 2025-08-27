import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Entries } from 'src/app/models/interface';
import { ActivatedRoute } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { AttributesService } from 'src/app/services/attributes/attributes.service';

declare var $: any;


@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})


export class AttributeComponent implements OnInit {
  attributeName: string = '';
  attributeForm: FormGroup;
  searchForm: FormGroup;
  attributesList: any[] = [];
  attibuteInfo: any;
  totalResult: number;
  modelType: string = 'Add';
  searchValue: string = '';
  attributeID: string;

  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  currentPage: number = 1;
  limit: any = 25;


  constructor(private router: ActivatedRoute,
    private _location: Location,
    private fb: FormBuilder,
    private commonService: CommonService,
    private attributeService: AttributesService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,) {
    this.attributeID = this.router.snapshot.paramMap.get('id');

    this.router.queryParams.subscribe((params) => {
      this.attributeName = params?.attributeName ? params.attributeName : '';
    });

  }

  ngOnInit(): void {
    this.attributeForm = this.fb.group({
      id: [null],
      name_en: ['', Validators.required],
      name_ar: ['', Validators.required],
    })

    this.searchForm = this.fb.group({
      word: [''],
    });

    this.getAttributesOptionsList();
  }

  get word() {
    return this.searchForm.get('word');
  }

  getAttributesOptionsList() {
    this.commonService.presentSpinner();
    this.attributeService.getAttributeOtionsList(this.attributeID, this.limit, this.currentPage, this.searchValue).subscribe((res) => {
      this.commonService.dismissSpinner();
      if (res) {
        this.attibuteInfo = res?.body?.result;
        const response = res?.body?.result;
        this.attributesList = response.options || [];
        this.totalResult = response?.totalNumber || 0;
        this.entries = this.commonService.calculateEntries(
          this.attributesList,
          this.currentPage,
          this.limit,
          this.totalResult
        );
        this.commonService.dismissSpinner();
      }
    },
      (error) => {
        this.attributesList = [];
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getAttributesOptionsList();
  }

  goBack() {
    this._location.back();
  }

  saveAttribute() {
    this.commonService.presentSpinner();
    if (this.attributeForm.value.id) {
      const data = {
        nameEn: this.attributeForm.value.name_en,
        nameAr: this.attributeForm.value.name_ar,
        status: "Active",
        attributeId: this.attributeID
      }

      this.attributeService.updateNewAttributeOption(data, this.attributeForm.value.id).subscribe(res => {
        this.closeModal();
        this.getAttributesOptionsList();
      },err => {
        this.closeModal();
        this.commonService.errorHandler(err);
        this.commonService.dismissSpinner();
      })
    } else {
      const data = {
        nameEn: this.attributeForm.value.name_en,
        nameAr: this.attributeForm.value.name_ar,
        status: "Active",
        attributeId: this.attributeID
      }

      this.attributeService.addNewAttributeOption(data).subscribe(res => {
        this.closeModal();
        this.getAttributesOptionsList();
      }, err => {
        this.closeModal();
        this.commonService.errorHandler(err);
        this.commonService.dismissSpinner();
      })
    }
  }


  filterBy() {
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getAttributesOptionsList();
    this.searchForm.get('word').setValue('');
  }

  openModal(type: string, attribute?: any) {
    this.modelType = type;
    if (type === "Add") {
      this.attributeForm.reset();
    } else {
      this.attributeForm.patchValue({
        id: attribute?.id,
        name_en: attribute?.nameEn,
        name_ar: attribute.nameAr
      })
    }
    $('#attribute-modal').modal('show');
  }

  closeModal() {
    $('#attribute-modal').modal('hide');
  }


  deleteAttribute(attributeId) {
    let options ={
      title: 'Are you Sure you want to delete this Option?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res)  {
        this.attributeService.deleteAttributeOption(attributeId).subscribe(()=> {
          this.getAttributesOptionsList();
        }, err => {
          this.commonService.errorHandler(err);
        })
      };
    });
  }

}
