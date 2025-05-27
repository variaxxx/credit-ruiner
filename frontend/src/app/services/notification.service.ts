import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface NotificationModel {
  type: NotificationType;
  msg: string;
}

export type NotificationType = 'error' | 'success' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification = new BehaviorSubject<NotificationModel | null>(null);
  public $notification = this.notification.asObservable();

  public throwError(error: string) {
    this.notification.next({
      type: 'error',
      msg: error
    });
  }

  public throwWarning(warning: string) {
    this.notification.next({
      type: 'warning',
      msg: warning
    });
  }

  public showInfo(info: string) {
    this.notification.next({
      type: 'info',
      msg: info
    });
  }

  public success(message: string) {
    this.notification.next({
      type: 'success',
      msg: message
    })
  }
}
