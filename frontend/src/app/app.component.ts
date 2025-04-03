import {Component, ComponentRef, inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NotificationComponent} from "./partials/notification/notification.component";
import {NotificationService, NotificationType} from "./services/notification.service";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('notification', {read: ViewContainerRef})
  private viewContainerRef!: ViewContainerRef;
  private componentRef!: ComponentRef<NotificationComponent>;

  private notificationService = inject(NotificationService);
  private activeNotifications: ComponentRef<NotificationComponent>[] = [];

  ngOnInit() {
    this.notificationService.$notification
      .subscribe((value) => this.triggerNotification(value?.type, value?.msg))
  }

  private triggerNotification(type: NotificationType | undefined, text: string | undefined) {
    if (text && type) {
      this.componentRef = this.viewContainerRef.createComponent(NotificationComponent);
      this.componentRef.instance.text = text;
      this.componentRef.instance.type = type;
      this.activeNotifications.push(this.componentRef);
      setTimeout(() => {
        this.activeNotifications[0].destroy();
        this.activeNotifications.shift();
      }, 5000)
    }
  }
}
