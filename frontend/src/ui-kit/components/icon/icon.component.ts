import {booleanAttribute, Component, HostBinding, inject, Input} from '@angular/core';
import {SafeHtml} from "@angular/platform-browser";
import {IconService} from "./icon.service";

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @HostBinding('class.filled')
  @Input({transform: booleanAttribute}) filled: boolean = false;
  @Input({required: true}) set icon(value: string) {
    this._icon = value;
    this._svg = this.iconService.get(this._icon);
  }

  @HostBinding('innerHTML') _svg?: SafeHtml;

  private _icon?: string;
  private iconService = inject(IconService);
}
