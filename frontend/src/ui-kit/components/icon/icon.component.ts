import {booleanAttribute, Component, HostBinding, Input} from '@angular/core';
import {SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input({required: true}) icon!: string;
  @Input({transform: booleanAttribute}) filled: boolean = false;

  @HostBinding('innerHTML') svg!: SafeHtml
}
