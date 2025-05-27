import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-select-item',
  imports: [],
  templateUrl: './select-item.component.html',
  styleUrl: './select-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelectItemComponent {
  @Input({required: true}) header!: string;
  @Input() description?: string;
}
