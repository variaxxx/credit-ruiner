import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-select-item',
  imports: [],
  templateUrl: './select-item.component.html',
  styleUrl: './select-item.component.scss'
})
export class SelectItemComponent {
  @Input({required: true}) header!: string;
  @Input() description?: string;
}
