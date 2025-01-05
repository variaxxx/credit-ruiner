import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {UserService} from "../../auth/user.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NgxSpinnerService} from "ngx-spinner";
import {ButtonComponent} from "../../../ui-kit/components/button/button.component";

@Component({
	selector: 'app-profile-page',
	imports: [
		ButtonComponent
	],
	templateUrl: './profile-page.component.html',
	styleUrl: './profile-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent implements OnInit {
	private userService = inject(UserService);
	private destroyRef = inject(DestroyRef);
	private spinner = inject(NgxSpinnerService)

	protected username = signal<string | undefined>(undefined);
	protected email = signal<string | undefined>(undefined);

	ngOnInit() {
		this.userService.getUser()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(value => {
				this.spinner.hide();
			});

		this.userService.userObservable()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(user => {
				if (user) {
					this.username.set(user.name);
					this.email.set(user.email);
				}
			})
	}

	protected readonly analysisHistory?: Array<string>;
}
