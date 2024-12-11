import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ButtonComponent} from "../../../../ui-kit/components/button/button.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-registration-page',
  standalone: true,
	imports: [
		ButtonComponent,
		ReactiveFormsModule
	],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class RegistrationPageComponent {
	public registerForm = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
		password_confirmation: new FormControl('', [Validators.required]),
		name: new FormControl('', [Validators.required])
	})

	public hidePassword: boolean = true;
	public wrongPassword: boolean = true;
}
