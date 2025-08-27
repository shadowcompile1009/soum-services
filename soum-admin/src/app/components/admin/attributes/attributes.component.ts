import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { Router } from '@angular/router';
import { Entries } from 'src/app/models/interface';
declare var $: any;
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {
  attributeForm: FormGroup
  attributeList: Array<any> = [];
  formData: FormData = new FormData();
  actionType: string = "add";
  currentPage: number = 1;
  totalResult: number;
  attributeToUpdate: any;
  limit: any = 50;

  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private commonService: CommonService,
    private attributeService: AttributesService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ConfirmationDeleteAttribute(attribute) {
    let options ={
      title: 'Are you Sure you want to delete this attribute?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res)  {this.deleteAttribute(attribute.id)};
    });
  }
  ngOnInit(): void {
    this.attributeForm = this.fb.group({
      'id': [null],
      'nameEn': ['', Validators.required],
      'nameAr': ['', Validators.required],
    })

    this.getAttributes()
  }

  //  this function in ngOnInit for get Category ** //
  getAttributes() {
    this.commonService.presentSpinner();
    this.attributeService.getNewAttributeList(this.limit, this.currentPage, false).subscribe(
      res => {
        const response = res?.body;
        this.attributeList = response.items || [];
        this.totalResult = response?.total || 0;
        this.entries = this.commonService.calculateEntries(
          this.attributeList,
          this.currentPage,
          this.limit,
          this.totalResult
        );

        this.commonService.dismissSpinner();
        this.attributeList = res?.body?.items || [];
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      });
  }

  saveAttribute() {
    if (this.attributeForm.value.id) {
      this.editAttribute()
    } else {
      this.commonService.presentSpinner();
      const data = {
        nameEn: this.attributeForm.value.nameEn,
        nameAr: this.attributeForm.value.nameAr,
        status: 'Active'
      }
      this.attributeService.addNewAttribute(data).subscribe(
        res => {
          this.commonService.dismissSpinner();
          this.attributeForm.reset();
          this.closeModal('attribute-attribute');
          this.getAttributes();
        }, (error) => {
          this.commonService.errorHandler(error);
        });
    }
  }

  closeModal(id: string) {
    this.attributeForm.reset();
    this.attributeToUpdate = null;
    $(`#${id}`).modal('hide');
  }

  navigateToAttribute(data: any) {
    this.router.navigate(['/admin/attribute', data?.id], { queryParams: { attributeName: data?.nameEn } });
  };

  viewAttributeDetails(attribute) {
    this.actionType = 'Edit',
    this.attributeForm.patchValue({
      id: attribute.id,
      nameEn: attribute.nameEn,
      nameAr: attribute.nameAr,
      status: "Active"
    })
    $('#attribute-modal').modal('show');
  };

  editAttribute() {
    this.commonService.presentSpinner();
    this.attributeService.updateNewAttribute({
      nameEn: this.attributeForm.value.nameEn,
      nameAr: this.attributeForm.value.nameAr,
      status: "Active"
    }, this.attributeForm.value.id).subscribe(
      (res) => {
        if (res) {
          this.commonService.dismissSpinner();
          this.attributeForm.reset();
          this.closeModal('attribute-attribute');
          this.getAttributes();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getAttributes();
  }

  deleteAttribute(attributeID) {
    this.commonService.presentSpinner();
    this.attributeService.deleteNewAttribute(attributeID).subscribe(
      (res) => {
        if (res.body.status || res.status == 200) {
          this.commonService.dismissSpinner();
          this.getAttributes();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    )
  }
}

export class Attribute {
  id: string = "";
  nameEn: string = "";
  nameAr: string = "";
  options: [];
}
