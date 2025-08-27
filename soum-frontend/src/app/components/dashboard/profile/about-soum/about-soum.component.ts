import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-soum',
  templateUrl: './about-soum.component.html',
  styleUrls: ['./about-soum.component.scss']
})
export class AboutSoumComponent {
  constructor(private router: Router) {}

  goBack(pageURL) {
    this.router.navigate([pageURL]);
  }
}
