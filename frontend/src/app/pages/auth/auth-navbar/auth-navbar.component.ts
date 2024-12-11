import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './auth-navbar.component.html',
  styleUrl: './auth-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthNavbarComponent {
  private router = inject(Router);

  public isLogin = this.router.url === '/auth/login';
}
