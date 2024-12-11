import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonComponent} from "../../../../ui-kit/components/button/button.component";
import {AuthNavbarComponent} from "../auth-navbar/auth-navbar.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
	imports: [
		ReactiveFormsModule,
		ButtonComponent,
		AuthNavbarComponent
	],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class LoginPageComponent {
	public loginForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required])
	});

	public hidePassword: boolean = true;
	public wrongPassword: boolean = false;
}
