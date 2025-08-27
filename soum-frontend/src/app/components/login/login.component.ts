import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  currentTab: string = 'login';

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit(): void {
    clearTimeout(this.commonService.referralTimer);
  }

  toggleSignupLogin(type: 'login' | 'signup') {
    this.currentTab = type;
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
