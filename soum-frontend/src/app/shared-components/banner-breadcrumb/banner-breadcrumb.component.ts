import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-breadcrumb',
  templateUrl: './banner-breadcrumb.component.html',
  styleUrls: ['./banner-breadcrumb.component.scss']
})
export class BannerBreadcrumbComponent {
  @Input() type: boolean;
  @Input() photos: boolean;
  @Input() status: boolean;
  @Input() price: boolean;
  @Input() confirmation: boolean;  
}
