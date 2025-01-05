import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";
import {NavigationService} from "../../services/navigation.service";

@Component({
  selector: 'app-header',
  imports: [
    IconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private navigationService = inject(NavigationService);

  public triggerSidebar(event: MouseEvent) {
    event.stopPropagation();
    this.navigationService.triggerSidebar();
  }
}
