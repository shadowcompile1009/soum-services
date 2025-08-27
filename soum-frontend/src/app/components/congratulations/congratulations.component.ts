import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss']
})
export class CongratulationsComponent {
  productID: any;
  constructor(private router: Router) {
    this.productID = localStorage.getItem('productIDCon');
  }

  navigateToProduct() {
    this.router.navigate(['/product-detail'], {
      queryParams: { product: this.productID, type: 'new' }
    });
    localStorage.removeItem('productIDCon');
  }
  navigateToLastStep() {
    this.router.navigate(['/lastStep']);
  }
}
