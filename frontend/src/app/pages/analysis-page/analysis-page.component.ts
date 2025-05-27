import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {ButtonComponent} from "../../../ui-kit/components/button/button.component";
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";
import {InputComponent} from "../../../ui-kit/components/input/input.component";
import {
	AbstractControl, FormBuilder,
	FormControl,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators
} from "@angular/forms";
import {SelectItemComponent} from "../../../ui-kit/components/select-item/select-item.component";
import {
	AnalysisRequest,
	AnalysisService,
	HomeOwnershipT,
	PurposeT,
	TermT,
	YearsInJobT
} from "../../services/analysis.service";
import {InputSelectComponent, SelectOption} from "../../../ui-kit/components/input-select/input-select.component";
import {animate, query, style, transition, trigger} from "@angular/animations";
import {onOpenAnimation} from "../../app.animations";
import {NotificationService} from "../../services/notification.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";


export const integerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	if (control.value == null) return null;
	if (!/^\d+$/.test(control.value)) return { isNotInteger: true };
	return null;
}


export const slideAnimation = trigger('slideAnimation', [
	transition(':increment, :decrement', [
		query(':enter', [
			style({ opacity: 0, position: 'absolute' })
		]),

		query(':leave', [
			style({ opacity: 1, position: 'static' }),
		], { optional: true }),

		query(':leave', [
			animate('300ms ease-in-out', style({ opacity: 0 })),
		], { optional: true }),

		query(':leave', [
			style({ position: 'absolute' })
		], { optional: true }),

		query(':enter', [
			style({ position: 'static' }),
		]),

		query(':enter', [
			animate('300ms ease-in-out', style({ opacity: 1 })),
		], { optional: true }),
	])
]);


@Component({
	selector: 'app-analysis-page',
	imports: [
		ButtonComponent,
		IconComponent,
		InputComponent,
		SelectItemComponent,
		ReactiveFormsModule,
		InputSelectComponent
	],
	templateUrl: './analysis-page.component.html',
	styleUrl: './analysis-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [slideAnimation, onOpenAnimation]
})
export class AnalysisPageComponent {
	private fb = inject(FormBuilder);
	private notificationService = inject(NotificationService);
	private analysisService = inject(AnalysisService);
	private destroyRef = inject(DestroyRef);
	private router = inject(Router);

	protected inProgress = signal<boolean>(false);
	protected currentSlide = signal<number>(1);

	protected readonly yearsInJobOptions: SelectOption<YearsInJobT>[] = [
		{
			label: 'Менее 1',
			option: '<1'
		},
		{
			label: '1 год',
			option: '1'
		},
		{
			label: '2 года',
			option: '2'
		},
		{
			label: '3 года',
			option: '3'
		},
		{
			label: '4 года',
			option: '4'
		},
		{
			label: '5 лет',
			option: '5'
		},
		{
			label: '6 лет',
			option: '6'
		},
		{
			label: '7 лет',
			option: '7'
		},
		{
			label: '8 лет',
			option: '8'
		},
		{
			label: '9 лет',
			option: '9'
		},
		{
			label: 'Более 10 лет',
			option: '>10'
		},
	]
	protected readonly homeOwnershipOptions: SelectOption<HomeOwnershipT>[] = [
		{
			label: 'Собственное',
			option: 'OWN'
		},
		{
			label: 'Аренда',
			option: 'RENT'
		},
		{
			label: 'Ипотека',
			option: 'MORTGAGE'
		}
	]
	protected readonly purposeOptions: SelectOption<PurposeT>[] = [
		{
			label: 'Бизнес',
			option: 'BUSINESS'
		},
		{
			label: 'Покупка автомобиля',
			option: 'CAR'
		},
		{
			label: 'Покупка жилья',
			option: 'HOUSE'
		},
		{
			label: 'Погашение кредита',
			option: 'DEBTCONSOLIDATION'
		},
		{
			label: 'Образование',
			option: 'EDUCATION'
		},
		{
			label: 'Ремонт дома',
			option: 'HOMEIMPROVEMENT'
		},
		{
			label: 'Крупная покупка',
			option: 'MAJORPURCHASE'
		},
		{
			label: 'Медицина',
			option: 'MEDICAL'
		},
		{
			label: 'Переезд',
			option: 'MOVING'
		},
		{
			label: 'Путешествие',
			option: 'TRIP'
		},
		{
			label: 'Отпуск',
			option: 'VACATION'
		},
		{
			label: 'Свадьба',
			option: 'WEDDING'
		},
		{
			label: 'Образование',
			option: 'EDUCATION'
		},
		{
			label: 'Малый бизнес',
			option: 'SMALLBUSINESS'
		},
		{
			label: 'Прочее',
			option: 'OTHER'
		}
	]

	protected form = this.fb.group({
		slide1: this.fb.group({
			name: this.fb.control<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(80)]),
			current_loan_amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), integerValidator]),
			term: this.fb.control<TermT | null>(null, [Validators.required]),
		}),
		slide2: this.fb.group({
			years_in_job: this.fb.control<YearsInJobT | null>(null, [Validators.required]),
			home_ownership: this.fb.control<HomeOwnershipT | null>(null, [Validators.required]),
			annual_income: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), integerValidator]),
		}),
		slide3: this.fb.group({
			purpose: this.fb.control<PurposeT | null>(null, [Validators.required]),
			monthly_debt: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
			years_of_credit_history: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
		}),
		slide4: this.fb.group({
			months_since_delinquent: this.fb.control<number | null>(null, [Validators.min(-1), integerValidator]),
			number_of_accounts: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), integerValidator]),
			number_of_problems: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), integerValidator]),
		}),
		slide5: this.fb.group({
			current_credit_balance: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
			bankruptcies: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), integerValidator]),
			tax_liens: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), integerValidator])
		})
	})

	protected getControl(slide: number, name: string) {
		const control = this.form.get(`slide${slide}`)?.get(name);
		if (control && control instanceof FormControl) {
			return control as FormControl;
		}
		throw new Error(`Unknown control: ${name}`);
	}

	protected selectTerm(value: TermT) {
		this.form.controls.slide1.controls.term.setValue(value);
	}

	protected isSelectedTerm(value: string) {
		return this.form.controls.slide1.controls.term.value === value;
	}

	protected getStepperIcon(index: number) {
		return this.form.get(`slide${index}`)?.valid ? 'check' : 'x';
	}

	protected onSubmit() {
		if (this.form.invalid) {
			this.notificationService.throwWarning('Вернитесь и заполните все поля корректно!');
		} else {
      if (!this.form.controls.slide4.controls.months_since_delinquent.value) {
        this.form.controls.slide4.controls.months_since_delinquent.setValue(-1);
      }
      this.notificationService.showInfo('Ваш запрос был отправлен. Ожидайте ответа.');
			this.analysisService.doAnalysis(
				{
					...this.form.controls.slide1.value,
					...this.form.controls.slide2.value,
					...this.form.controls.slide3.value,
					...this.form.controls.slide4.value,
					...this.form.controls.slide5.value
				} as AnalysisRequest
			)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((res) => {
					this.router.navigateByUrl(`/history/${res.id}`)
				})
		}
	}
}
