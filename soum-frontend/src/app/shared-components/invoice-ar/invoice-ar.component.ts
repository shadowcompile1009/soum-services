import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-ar',
  templateUrl: './invoice-ar.component.html',
  styleUrls: ['./invoice-ar.component.scss']
})
export class InvoiceArComponent {
  @Input() orderDetails: any;
}
