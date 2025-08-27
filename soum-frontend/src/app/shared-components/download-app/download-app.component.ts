import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent {
  appStoreLnk =
    'https://apps.apple.com/sa/app/soum-%D8%B3%D9%80%D9%88%D9%85/id1580930409';

  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<DownloadAppComponent>
  ) {}

  navigateAppStore() {
    window.open(this.appStoreLnk, '_blank');
    this.dialogRef.close();
  }

  hideDownloadApp() {
    this.dialogRef.close();
  }
}
