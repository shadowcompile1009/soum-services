import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-en',
  templateUrl: './invoice-en.component.html',
  styleUrls: ['./invoice-en.component.scss']
})
export class InvoiceEnComponent {
  @Input() orderDetails: any;
}
