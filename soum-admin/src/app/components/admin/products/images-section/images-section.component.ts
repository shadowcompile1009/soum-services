import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ImageRestructionsService } from 'src/app/services/image-restructions/image-restructions.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Section } from './sectionType';
declare var $: any;

@Component({
  selector: 'app-images-section',
  templateUrl: './images-section.component.html',
  styleUrls: ['./images-section.component.scss']
})

export class ImagesSectionComponent implements OnInit {

  sectionsList: any[] = [];
  sectionFiles: any = [];
  loading: boolean = false;
  @Input() productId: any;
  activeSection: Section;
  activeSectionIndex: number = 0;
  isVisibleMulti: boolean = false;
  isVisibleSingle: boolean = false;
  imageUrls: (string | ArrayBuffer | null)[] = [];
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;

  constructor(private imageService: ImageRestructionsService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getDummySectionsImages()
  }

  editSectionAction(section: Section, sectionIndex: number) {
    this.imageUrls = [];
    this.sectionFiles = [];
    this.activeSection = section;
    this.activeSectionIndex = sectionIndex;
    this.imageUrls.push(...section.urls)
    this.sectionFiles.push(...section.urls);
    this.showModalSection();
  }

  selectImage(event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const maxRequiredFiles = this.activeSection.maxImageCount - this.imageUrls.length;

      Array.from(input.files).slice(0, maxRequiredFiles).forEach((file) => {
        const reader = new FileReader();
        this.sectionFiles.push({ type: 'file', file: file });
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.imageUrls.push(e.target?.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  getDummySectionsImages() {
    this.commonService.presentSpinner();
    this.imageService.getDummySectionsImages(this.productId).subscribe((res: any) => {
      this.sectionsList = res?.body?.data?.deepLoadProduct?.imageSections || [];
      this.commonService.dismissSpinner();
    }, (err: any) => {
      this.commonService.errorHandler(err);
    })
  }

  deleteImage(imageSectionIndex: number) {
    this.imageUrls.splice(imageSectionIndex, 1);
    this.sectionFiles.splice(imageSectionIndex, 1);
  }

  EditSectionImages() {
    if (this.imageUrls.length >= this.activeSection?.minImageCount) {
      const urls = [];
      const files = [];
      (this.sectionFiles || []).forEach(element => {
        if (element?.type === 'file') {
          files.push(element.file);
        } else {
          urls.push(element);
        }
      });
      files.length ? this.updateWithChangeFiles(files, urls) : this.updateOriginalImages(urls)
    }
  }

  updateWithChangeFiles(files: any, urls: any) {
    this.commonService.presentSpinner();
    this.loading = true;
    this.imageService.requestUrlToUploadImage(files.length, 'png', 'productImage').subscribe((res: any) => {
      if (res.status === 200) {
        const imagePaths = (res?.body || []).map((path: any) => { return { relativePath: path.path, base: path.cdn } });
        const urlsPaths = (urls || []).map((url: any) => { return { relativePath: url.relativePath, base: url.base } });
        this.commonService.presentSpinner();
        this.imageService.sendMultiplePutRequests(res?.body, files).subscribe((res) => {
          const allImagesPaths = [...urlsPaths, ...imagePaths];
          this.commonService.successToaster('Images Uploaded Successfully!!');
          const dataSection = {
            productAction: "adminImageUpdate",
            productImageSections: [
              {
                id: this.activeSection.id,
                productId: this.productId,
                urls: allImagesPaths
              }
            ]
          };
          this.commonService.presentSpinner();
          this.imageService.updateImageSection(this.productId, dataSection).subscribe((res: any) => {
            this.closeModalSection();
            this.getDummySectionsImages();
            this.commonService.dismissSpinner();
            this.commonService.successToaster('Image Section Updated Successfully!!');
            this.loading = false;
          }, (err: any) => {
            this.loading = false;
            this.commonService.dismissSpinner();
            this.commonService.errorHandler(err);
          })
        }, (err: any) => {
          this.loading = false;
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(err);
        })
      }
    }, (err: any) => {
      this.loading = false;
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(err);
    });
  }

  updateOriginalImages(urls: any) {
    const urlsPaths = (urls || []).map((url: any) => { return { relativePath: url.relativePath, base: url.base } });
    const dataSection = {
      productAction: "adminImageUpdate",
      productImageSections: [
        {
          id: this.activeSection.id,
          productId: this.productId,
          urls: urlsPaths
        }
      ]
    };
    this.commonService.presentSpinner();
    this.loading = true;
    this.imageService.updateImageSection(this.productId, dataSection).subscribe((res: any) => {
      this.closeModalSection();
      this.getDummySectionsImages();
      this.commonService.dismissSpinner();
      this.commonService.successToaster('Image Section Updated Successfully!!');
      this.loading = false;
    }, (err: any) => {
      this.commonService.dismissSpinner();
      this.loading = false;
      this.commonService.errorHandler(err);
    })
  }

  scrollToDiv() {
    this.scrollTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  showModalSection() {
    $('#section-modal').modal('show');
  }


  closeModalSection() {
    $('#section-modal').modal('hide');
  }
}
