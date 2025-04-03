import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ButtonComponent} from "../../../ui-kit/components/button/button.component";
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-welcome-page',
  imports: [
    ButtonComponent,
    IconComponent,
    RouterLink
  ],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomePageComponent {

}
