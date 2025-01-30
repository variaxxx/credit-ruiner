import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {IconComponent} from "../icon/icon.component";
import {ButtonSize} from "../button/button.component";

@Component({
  selector: 'app-icon-button',
  imports: [
    IconComponent
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IconButtonComponent {
  @Input({required: true}) icon!: string;
  @Input() size: ButtonSize = 'md';
}
