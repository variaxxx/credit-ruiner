import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {onOpenAnimation} from "../../app.animations";

@Component({
  selector: 'app-home-page',
	imports: [
	],
  templateUrl: './home-page.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [onOpenAnimation]
})
export class HomePageComponent {
  private userService = inject(UserService);

  protected readonly user$ = toSignal(this.userService.$user); 
}
