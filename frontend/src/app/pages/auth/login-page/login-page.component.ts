import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	ViewEncapsulation
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonComponent} from "../../../../ui-kit/components/button/button.component";
import {IconComponent} from "../../../../ui-kit/components/icon/icon.component";
import {Router} from "@angular/router";
import {UserService} from "../../../auth/user.service";
import {InputComponent} from "../../../../ui-kit/components/input/input.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-login-page',
	imports: [
		ReactiveFormsModule,
		ButtonComponent,
		IconComponent,
		InputComponent
	],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class LoginPageComponent {
	private router = inject(Router);
	private userService = inject(UserService);
	private cdr = inject(ChangeDetectorRef);
	private destroyRef = inject(DestroyRef);

	public loginForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required])
	});

	public clientError: string | null = null;
	public serverError: string | null = null;

	public login() {
		this.serverError = null;
		this.clientError = null;
		if (this.loginForm.valid) {
			this.userService.login(this.loginForm.value)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: value => {
						this.router.navigateByUrl('');
						console.log('Successfully logged in!');
					},
					error: err => {
						this.serverError = err.status === 401 ? 'Неправильный пароль или пользователя не существует' : 'Произошла ошибка, попробуйте еще раз';
						this.cdr.markForCheck();
					}
				})
		} else {
			this.clientError = 'Заполните все поля корректно';
		}
	}

	protected getControl(controlName: string): FormControl {
		return this.loginForm.get(controlName) as FormControl
	}
}