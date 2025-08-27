import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect-message-login',
  templateUrl: './redirect-message-login.component.html',
  styleUrls: ['./redirect-message-login.component.scss']
})
export class RedirectMessageLoginComponent {
  constructor(
    private dialogRef: MatDialogRef<RedirectMessageLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  redirectToSign() {
    this.closeModal();
    this.data.route = this.data?.route ? this.data?.route : this.router.url;
    sessionStorage.setItem('redirectURL', this.data.route);
    this.router.navigate(['/login/continue']);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
