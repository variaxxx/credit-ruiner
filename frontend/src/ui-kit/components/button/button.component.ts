import {booleanAttribute, ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor = 'white' | 'green' | 'black';
export type ButtonType = 'primary' | 'secondary';

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() size: ButtonSize = 'md';
  @Input() color: ButtonColor = 'white';
  @Input() type: ButtonType = 'secondary';
  @Input({transform: booleanAttribute}) submit: boolean = false;
}
