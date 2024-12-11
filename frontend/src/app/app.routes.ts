import { Routes } from '@angular/router';
import {SidebarLayoutComponent} from "./layouts/sidebar-layout/sidebar-layout.component";
import {isLoggedGuard} from "./guards/is-logged.guard";
import {LoginPageComponent} from "./pages/auth/login-page/login-page.component";
import {RegistrationPageComponent} from "./pages/auth/registration-page/registration-page.component";
import {SidebarComponent} from "./partials/sidebar/sidebar.component";
import {FooterComponent} from "./partials/footer/footer.component";
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";

export const routes: Routes = [
	{
		path: '',
		component: SidebarLayoutComponent,
		canActivate: [isLoggedGuard],
		children: [
			{
				path: '',
				outlet: 'sidebar',
				component: SidebarComponent
			},
			{
				path: '',
				outlet: 'footer',
				component: FooterComponent
			}
		]// TODO: fill children
	},
	{
		path: 'auth',
		redirectTo: 'auth/login',
		pathMatch: 'full'
	},
	{
		path: 'auth',
		component: AuthLayoutComponent,
		children: [
			{
				path: 'login',
				component: LoginPageComponent,
			},
			{
				path: 'register',
				component: RegistrationPageComponent
			}
		]
	}
];
