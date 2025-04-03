import {
	ChangeDetectionStrategy,
	Component, DestroyRef, ElementRef, EventEmitter,
	HostListener, inject,
	Input,
	OnInit,
	signal,
	ViewEncapsulation
} from '@angular/core';
import {IconComponent} from "../icon/icon.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface SelectOption<T> {
	label: string,
	option: T
}

@Component({
	selector: 'app-input-select',
	imports: [
		IconComponent,
	],
	templateUrl: './input-select.component.html',
	styleUrl: './input-select.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('fadeInOut', [
			state('void', style({opacity: 0})),
			transition(':enter', [
				style({
					opacity: 0,
					transform: 'translateY(-8px)',
				}),
				animate('250ms ease-in-out', style({
					opacity: 1,
					transform: 'translateY(0)',
				})),
			]),
			transition(':leave', [
				style({
					opacity: 1,
					transform: 'translateY(0)',
				}),
				animate('250ms ease-in-out', style({
					opacity: 0,
					transform: 'translateY(-8px)',
				}))
			])
		])
	]
})
export class InputSelectComponent implements OnInit {
	@Input({required: true}) options!: SelectOption<any>[];
	@Input({required: true}) label!: string;
	@Input({required: true}) control!: FormControl;

	private el = inject(ElementRef);
	private destroyRef = inject(DestroyRef);

	private static closeAll = new EventEmitter();

	@HostListener('document:click', ['$event']) onClick(event: MouseEvent) {
		const clickedOnSelect = this.el.nativeElement.contains(event.target);
		if (this.isOpened() && !clickedOnSelect) {
			this.triggerList();
		}
	}

	protected isOpened = signal<boolean>(false);
	protected selectedItem = signal<null | number>(null);

	ngOnInit() {
		if (this.control.value) {
			this.selectedItem.set(this.options.findIndex((val) => val.option == this.control.value));
		}

		InputSelectComponent.closeAll
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.closeList();
			})
	}

	protected closeList() {
		this.isOpened.set(false);
	}

	protected triggerList(event?: MouseEvent) {
		event?.stopPropagation();
		event?.preventDefault();

		if (!this.isOpened()) {
			InputSelectComponent.closeAll.emit();
		}

		this.isOpened.set(!this.isOpened());
	}

	protected selectItem(index: number) {
		this.selectedItem.set(index);
		this.control.setValue(this.options[index].option);
		this.triggerList();
	}

	protected getSelectedItem() {
		const index = this.selectedItem();
		return index !== null ? this.options[index]?.label : 'Выберите';
	}
}

