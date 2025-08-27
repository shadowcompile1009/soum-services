import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-redirect-page',
  templateUrl: './redirect-page.component.html',
  styleUrls: ['./redirect-page.component.scss']
})
export class RedirectPageComponent implements OnInit {
  counter = 15;
  ngOnInit(): void {
    setTimeout(() => {
      window.location.replace('https://info.soum.sa/');
    }, 15000);

    setInterval(() => {
      this.counter = this.counter - 1;
    }, 1000);
  }
}
