import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { merge, Subject } from 'rxjs';
import { debounceTime, filter, startWith, switchMap, tap } from 'rxjs/operators';
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

  currencies = ['USD', 'EUR', 'UAH', 'NZD', 'CAD', 'SAR'];
 
  exchangeRateForm = inject(FormBuilder).group({
    firstCurrencyRate: ['1', [Validators.required, numericValidator()]],
    firstCurrencyName: ['UAH', Validators.required],
    secondCurrencyRate: ['0', [Validators.required, numericValidator()]],
    secondCurrencyName: ['USD', Validators.required]
  });
  
  firstCurrencyRateChange$ = new Subject<Event>(); 
  firstCurrencyNameChange$ = new Subject<Event>(); 
  secondCurrencyRateChange$ = new Subject<Event>(); 
  secondCurrencyNameChange$ = new Subject<Event>();

  constructor() {
    merge(
      this.firstCurrencyNameChange$, 
      this.firstCurrencyRateChange$.pipe(
        filter((event: Event) => !isNaN(Number((event.target as any).value)))
      ),
    ).pipe(
      debounceTime(300),
      startWith(0),
      switchMap(() => this.conversionService.getExchangeRate(
        this.getFormFieldValue('firstCurrencyName'),
        this.getFormFieldValue('secondCurrencyName'),
        this.getFormFieldValue('firstCurrencyRate')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((rate: string) => 
      this.exchangeRateForm.controls.secondCurrencyRate.setValue(rate));

    merge(
      this.secondCurrencyNameChange$,
      this.secondCurrencyRateChange$.pipe(
        filter((event: Event) => !isNaN(Number((event.target as any).value)))
      )
    ).pipe(
      debounceTime(300),
      switchMap(() => this.conversionService.getExchangeRate(
        this.getFormFieldValue('secondCurrencyName'),
        this.getFormFieldValue('firstCurrencyName'),
        this.getFormFieldValue('secondCurrencyRate')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((rate: string) => 
      this.exchangeRateForm.controls.firstCurrencyRate.setValue(rate));
  }

  private getFormFieldValue(fieldName: string) {
    return this.exchangeRateForm.get(fieldName)?.getRawValue();
  }

}
