import { Component, inject, input, InputSignal } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlErrorDirective } from '../../directives/control-error.directive';
import { numericValidator } from '../../validators/numeric-validator';

@Component({
  selector: 'app-currency-group',
  standalone: true,
  imports: [ReactiveFormsModule, ControlErrorDirective],
  templateUrl: './currency-group.component.html',
  styleUrl: './currency-group.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class CurrencyGroupComponent {
  currencyControlKey: InputSignal<string> = input.required();
  currencyOptions: InputSignal<string[]> = input.required();
  private formBuilder = inject(FormBuilder);

  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(this.currencyControlKey(), this.formBuilder.group({
      rate: ['1', [Validators.required, numericValidator()]],
      name: ['UAH', Validators.required]
    }));
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.currencyControlKey());
  }
}
