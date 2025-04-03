import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	HostListener,
	inject,
	OnInit,
	signal, ViewChild
} from '@angular/core';
import {EditProfileData, UserService} from "../../services/user.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NgxSpinnerService} from "ngx-spinner";
import {ButtonComponent} from "../../../ui-kit/components/button/button.component";
import {RouterLink} from "@angular/router";
import {AnalysisHistoryResponse, AnalysisService} from "../../services/analysis.service";
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";
import {InputComponent} from "../../../ui-kit/components/input/input.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NotificationService} from "../../services/notification.service";
import {IconButtonComponent} from "../../../ui-kit/components/icon-button/icon-button.component";
import {onOpenAnimation} from "../../app.animations";

@Component({
	selector: 'app-profile-page',
	imports: [
		ButtonComponent,
		RouterLink,
		IconComponent,
		InputComponent,
		ReactiveFormsModule,
		IconButtonComponent
	],
	templateUrl: './profile-page.component.html',
	styleUrl: './profile-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [onOpenAnimation]
})
export class ProfilePageComponent implements OnInit {
	private userService = inject(UserService);
	private destroyRef = inject(DestroyRef);
	private spinner = inject(NgxSpinnerService);
	private analysisService = inject(AnalysisService);
	private notificationService = inject(NotificationService);

	protected username = signal<string | undefined>(undefined);
	protected email = signal<string | undefined>(undefined);
	protected analysisHistory = signal<AnalysisHistoryResponse | undefined>(undefined);
	protected isEditing = signal<boolean>(false);

	protected editForm = new FormGroup({
		name: new FormControl(this.username(), [Validators.required, Validators.maxLength(80)]),
		email: new FormControl(this.email(), [Validators.required, Validators.email, Validators.maxLength(80)])
	})

	@ViewChild('modal') modal!: ElementRef;

	@HostListener('document:click', ['$event']) onClick(event: MouseEvent) {
		if (this.isEditing()) {
			const clickedOnModal = this.modal.nativeElement.contains(event.target);
			if (!clickedOnModal) {
				event.stopPropagation();
				event.preventDefault();
				this.triggerEditModal();
			}
		}
	}

	@HostListener('document:keyup.escape', ['$event']) onEscUp(event: KeyboardEvent) {
		if (this.isEditing()) this.triggerEditModal();
	}

	ngOnInit() {
		this.spinner.show();

		this.userService.getUser()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(value => {
				this.spinner.hide();
			});

		this.userService.$user
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(user => {
				if (user) {
					this.username.set(user.name);
					this.email.set(user.email);
				}
			})

		this.analysisService.getHistory(1, 3)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((val) => {
				this.analysisHistory.set(val);
			})
	}

	protected getControl(controlName: string): FormControl {
		return this.editForm.get(controlName) as FormControl
	}

	protected logout() {
		this.userService.logout();
	}

	private triggerEditModal() {
		this.isEditing.set(!this.isEditing());
	}

	protected editButtonPressed(event: MouseEvent) {
		event.stopPropagation();
		this.triggerEditModal();
	}

	protected editProfile() {
		if (!this.editForm.value.name && !this.editForm.value.email) {
			this.notificationService.throwError('Поля не должны быть пустыми.');
		} else if (this.editForm.invalid) {
			this.notificationService.throwError('Заполните поля корректно.');
		} else {
			this.userService.editProfile(this.editForm.value as EditProfileData)
				.pipe(
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe(value => {
					this.isEditing.set(false);
					this.notificationService.success('Информация о Вас успешно изменена.');
				})
		}
	}
}
