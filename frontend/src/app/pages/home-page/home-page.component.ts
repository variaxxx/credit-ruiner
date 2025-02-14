import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private spinnerService = inject(NgxSpinnerService);

  protected readonly user$ = toSignal(this.userService.$user); 
}
