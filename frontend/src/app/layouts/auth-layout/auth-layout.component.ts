import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthNavbarComponent} from "../../pages/auth/auth-navbar/auth-navbar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    AuthNavbarComponent,
    RouterOutlet
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {
}
