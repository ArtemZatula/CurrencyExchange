import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { merge } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ConversionService } from '../../services/conversion.service';
import { numericValidator } from '../../common/validators/numeric-validator';
import { ControlErrorDirective } from '../../common/directives/control-error.directive';


@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [ReactiveFormsModule, ControlErrorDirective],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.scss'
})
export class ConversionComponent {
  private conversionService = inject(ConversionService);
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);

  currencies = ['USD', 'EUR', 'UAH', 'NZD', 'CAD', 'SAR'];

  firstCurrencyForm = this.formBuilder.group({
    firstCurrencyRate: ['1', [Validators.required, numericValidator()]],
    firstCurrencyName: ['UAH', Validators.required]
  });

  secondCurrencyForm = this.formBuilder.group({
    secondCurrencyRate: ['0', [Validators.required, numericValidator()]],
    secondCurrencyName: ['USD', Validators.required]
  });

  constructor() {
    const firstCurrencyChanges$ = this.firstCurrencyForm.valueChanges.pipe(
      startWith(this.firstCurrencyForm.value),
      map(formValues => [
        [ formValues.firstCurrencyName, 
          this.secondCurrencyForm.value.secondCurrencyName,
          formValues.firstCurrencyRate ], 
        this.secondCurrencyForm.controls.secondCurrencyRate
      ])
    );

    const secondCurrencyChanges$ = this.secondCurrencyForm.valueChanges.pipe(
      map((formValues) => [
        [ formValues.secondCurrencyName, 
          this.firstCurrencyForm.value.firstCurrencyName, 
          formValues.secondCurrencyRate ],
        this.firstCurrencyForm.controls.firstCurrencyRate
      ])
    );

    merge(firstCurrencyChanges$, secondCurrencyChanges$).pipe(
      debounceTime(300),
      switchMap(([values, formControlToUpdate]) => 
        this.conversionService.getExchangeRate(...values as [string, string]).pipe(
          tap((result: string) => (formControlToUpdate as FormControl).setValue(result, {emitEvent: false}))
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
