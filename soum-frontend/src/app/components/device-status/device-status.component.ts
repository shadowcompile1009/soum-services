import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss']
})
export class DeviceStatusComponent {

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/products']);
  }

}
