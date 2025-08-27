import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.scss']
})
export class ProductsHeaderComponent {
  @Input() arabic: string;
  @Output() changeLan: EventEmitter<any> = new EventEmitter();
  @Output() addGtmSociialMedia: EventEmitter<any> = new EventEmitter();

  constructor(public translate: TranslateService) {}

  changeLanguage() {
    this.changeLan.emit();
  }

  addGtmSocialMedia(socialName: string) {
    this.addGtmSociialMedia.emit(socialName);
  }
}
