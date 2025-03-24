import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {IconComponent} from "../icon/icon.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-input',
  imports: [
    IconComponent,
    ReactiveFormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InputComponent {
  @Input({transform: booleanAttribute}) showEye?: boolean;
  @Input() type?: string;
  @Input({required: true}) control!: FormControl;
  @Input({required: true}) label!: string;
  @Input({required: true}) name!: string;
  @Input({required: true}) placeholder!: string;
  @Input({required: true}) autocomplete!: string;
  @Input({transform: booleanAttribute}) light: boolean = false;

  @Output() eyeClicked = new EventEmitter();

  protected hideInput: boolean = true;

  protected getType() {
    if (this.showEye) {
      return this.hideInput ? 'password' : 'text';
    }
    return this.type;
  }

  protected eyeTriggered() {
    this.hideInput = !this.hideInput;
    this.eyeClicked.emit(this.hideInput);
  }
}
