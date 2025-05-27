import {Component, HostBinding, Input} from '@angular/core';
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";
import {NotificationType} from "../../services/notification.service";

@Component({
  selector: 'app-notification',
  imports: [
    IconComponent
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @HostBinding('attr.data-type')
  @Input({ required: true }) type!: NotificationType;
  @Input({ required: true }) text!: string;

  get title() {
    if (this.type == 'warning') return 'Предупреждение';
    if (this.type == 'error') return 'Ошибка';
    if (this.type == 'success') return 'Успешно';
    return 'Информация'
  }

  get icon() {
    if (this.type == 'warning') return 'alert-triangle';
    if (this.type == 'error') return 'slash';
    if (this.type == 'success') return 'check-check';
    return 'info'
  }
}
