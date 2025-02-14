import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ButtonComponent} from "../../../ui-kit/components/button/button.component";
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";
import {InputComponent} from "../../../ui-kit/components/input/input.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectItemComponent} from "../../../ui-kit/components/select-item/select-item.component";

@Component({
  selector: 'app-analysis-page',
  imports: [
    ButtonComponent,
    IconComponent,
    InputComponent,
    SelectItemComponent,
    ReactiveFormsModule
  ],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisPageComponent {
  private fb = inject(FormBuilder);

  protected inProgress = signal<boolean>(true);
  protected currentSlide = signal<number>(1);

  protected form = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(80)]),
    current_loan_amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    term: new FormControl<'LONG' | 'SHORT' | null>(null, [Validators.required]),
  })

  protected getControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  protected selectTerm(value: 'LONG' | 'SHORT') {
    this.form.controls.term.setValue(value);
  }

  protected isSelectedTerm(value: string) {
    return this.form.controls.term.value === value;
  }
}
