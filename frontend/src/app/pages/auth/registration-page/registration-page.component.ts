import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	ViewEncapsulation
} from '@angular/core';
import {ButtonComponent} from "../../../../ui-kit/components/button/button.component";
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators
} from "@angular/forms";
import {IconComponent} from "../../../../ui-kit/components/icon/icon.component";
import {UserModel, UserService} from "../../../auth/user.service";
import {Router} from "@angular/router";
import {InputComponent} from "../../../../ui-kit/components/input/input.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export const passwordConfirmation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	return control.value.password === control.value.password_confirmation ? null : {PasswordsDoNotMatch: true};
}

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const password = control.value;
	if (password.includes(' ')) return {SpacesAtPassword: true}
	return null;
}

@Component({
	selector: 'app-registration-page',
	imports: [
		ButtonComponent,
		IconComponent,
		ReactiveFormsModule,
		InputComponent
	],
	templateUrl: './registration-page.component.html',
	styleUrl: './registration-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationPageComponent {
	private userService = inject(UserService);
	private cdr = inject(ChangeDetectorRef);
	private router = inject(Router);
	private destroyRef = inject(DestroyRef);

	public registerForm = new FormGroup({
			name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
			email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(80)]),
			password: new FormControl('', [Validators.required, passwordValidator, Validators.minLength(6), Validators.maxLength(120)]),
			password_confirmation: new FormControl('', [Validators.required])
		},
		{
			validators: passwordConfirmation
		}
	)

	public clientError: string | null = null;
	public serverError: string | null = null;

	public register() {
		this.serverError = null;
		this.clientError = null;
		if (this.registerForm.valid) {
			const info: UserModel = {
				name: this.registerForm.value.name!,
				email: this.registerForm.value.email!,
				password: this.registerForm.value.password!
			}
			this.userService.registration(info)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: value => {
						this.router.navigateByUrl('/auth/login');
						console.log('Successfully registered!');
					},
					error: err => {
						this.serverError = err.status === 409 ? 'Данный адрес электронной почты уже используется' : 'Произошла ошибка, попробуйте еще раз';
						this.cdr.markForCheck();
					}
				})
		} else {
			console.log(this.registerForm.controls.password.errors);
			if (this.registerForm.controls.password.errors?.['SpacesAtPassword']) {
				this.clientError = 'Пароль не должен содержать пробелов';
			} else if (this.registerForm.controls.password.errors?.['minlength']) {
				this.clientError = 'Пароль должен содержать не менее 6 символов'
			} else if (this.registerForm.controls.password.errors?.['maxlength']) {
				this.clientError = 'Ваш пароль слишком длинный'
			} else if (this.registerForm.errors?.['PasswordsDoNotMatch']) {
				this.clientError = 'Пароли не совпадают';
			} else {
				this.clientError = 'Заполните все поля корректно';
			}
		}
	}

	protected getControl(controlName: string): FormControl {
		return this.registerForm.get(controlName) as FormControl
	}
}
