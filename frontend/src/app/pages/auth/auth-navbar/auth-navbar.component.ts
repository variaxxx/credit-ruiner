import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";

export interface AuthNavbarItem {
	label: string,
	url: string
}

@Component({
	selector: 'app-auth-navbar',
	imports: [
		RouterLink
	],
	templateUrl: './auth-navbar.component.html',
	styleUrl: './auth-navbar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthNavbarComponent {
	private router = inject(Router);

	protected readonly navbarItems: AuthNavbarItem[] = [
		{
			label: 'Главная',
			url: '/welcome',
		},
		{
			label: 'Вход',
			url: '/auth/login'
		},
		{
			label: 'Регистрация',
			url: '/auth/register'
		}
	]

	protected isActive(currentRoute: string) {
		return this.router.url.endsWith(currentRoute);
	}
}
