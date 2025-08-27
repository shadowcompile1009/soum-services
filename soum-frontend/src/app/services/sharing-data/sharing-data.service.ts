import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {
  userData: BehaviorSubject<any> = new BehaviorSubject(null);

  prepareStorageDataToShare() {
    let userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      userDetails = JSON.parse(JSON.parse(userDetails));
      this.userData.next(userDetails);
    }
  }
}
