import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'primary' | 'secondary';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() size: ButtonSize = 'md';
  @Input() type: ButtonType = 'secondary';
}
