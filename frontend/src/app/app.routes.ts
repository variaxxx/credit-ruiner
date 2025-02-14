import { Routes } from '@angular/router';
import {SidebarLayoutComponent} from "./layouts/sidebar-layout/sidebar-layout.component";
import {isLoggedGuard} from "./guards/is-logged.guard";
import {LoginPageComponent} from "./pages/auth/login-page/login-page.component";
import {RegistrationPageComponent} from "./pages/auth/registration-page/registration-page.component";
import {SidebarComponent} from "./partials/sidebar/sidebar.component";
import {FooterComponent} from "./partials/footer/footer.component";
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";
import {AnalysisPageComponent} from "./pages/analysis-page/analysis-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {isNotLoggedGuard} from "./guards/is-not-logged.guard";
import {WelcomePageComponent} from "./pages/welcome-page/welcome-page.component";
import {HistoryPageComponent} from "./pages/history-page/history-page.component";
import {AnalysisInfoPageComponent} from "./pages/history-page/analysis-info-page/analysis-info-page.component";

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
			},
			{
				path: '',
				component: HomePageComponent,
				title: 'Домашняя страница | CreditRuiner'
			},
			{
				path: 'analysis',
				component: AnalysisPageComponent,
				title: 'Анализ кредитоспособности | CreditRuiner'
			},
			{
				path: 'profile',
				component: ProfilePageComponent,
				title: 'Мой профиль | CreditRuiner'
			},
			{
				path: 'history',
				component: HistoryPageComponent,
				title: 'История проведенных анализов | CreditRuiner',
				pathMatch: 'full'
			},
			{
				path: 'history/:id',
				component: AnalysisInfoPageComponent,
				title: 'Подробности анализа | CreditRuiner'
			}
		]
	},
	{
		path: 'welcome',
		component: WelcomePageComponent,
		canActivate: [isNotLoggedGuard],
		title: 'Ваш путь к финансовой свободе | CreditRuiner'
	},
	{
		path: 'auth',
		redirectTo: 'auth/login',
		pathMatch: 'full'
	},
	{
		path: 'auth',
		component: AuthLayoutComponent,
		canActivate: [isNotLoggedGuard],
		children: [
			{
				path: 'login',
				component: LoginPageComponent,
				title: 'Вход в аккаунт | CreditRuiner'
			},
			{
				path: 'register',
				component: RegistrationPageComponent,
				title: 'Регистрация нового пользователя | CreditRuiner'
			}
		]
	}
];
