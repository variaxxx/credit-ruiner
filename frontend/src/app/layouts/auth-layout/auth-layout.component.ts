import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthNavbarComponent} from "../../pages/auth/auth-navbar/auth-navbar.component";
import {RouterOutlet} from "@angular/router";
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";

@Component({
	selector: 'app-auth-layout',
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
