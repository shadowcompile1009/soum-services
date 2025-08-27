import { Injectable } from '@angular/core';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private httpWrapper: HttpWrapperService) {}

  getNotificationList() {
    return this.httpWrapper.get(ApiEndpoints.getNotificationList);
  }

  markNotificationAsRead(notifiyID) {
    return this.httpWrapper.put(
      ApiEndpoints.markNotificationAsRead(notifiyID),
      {}
    );
  }

  clearAllNotification() {
    return this.httpWrapper.put(ApiEndpoints.clearAllNotification, {});
  }
}
