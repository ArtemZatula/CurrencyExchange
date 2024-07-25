import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'; 
import { merge, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ConversionService } from '../../services/conversion.service';


interface ExchangeRateForm {
  firstCurrencyValue: string;
  firstCurrencyName: string;
  secondCurrencyValue: string; 
  secondCurrencyName: string;
}

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.scss'
})
export class ConversionComponent {
  private conversionService = inject(ConversionService);
  private destroyRef = inject(DestroyRef);
  currencies = ['USD', 'EUR', 'UAH', 'NZD', 'CAD', 'SAR'];
 
  exchangeRateForm = inject(FormBuilder).group<ExchangeRateForm>({
    firstCurrencyValue: '1', 
    firstCurrencyName: 'UAH',
    secondCurrencyValue: '1', 
    secondCurrencyName: 'USD'
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
      )
    ).pipe(
      debounceTime(300),
      switchMap(() => this.conversionService.getExchangeRate(
        this.getFormFieldValue('firstCurrencyName'),
        this.getFormFieldValue('secondCurrencyName'),
        this.getFormFieldValue('firstCurrencyValue')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((rate: string) => 
      this.exchangeRateForm.controls.secondCurrencyValue.setValue(rate));

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
        this.getFormFieldValue('secondCurrencyValue')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((rate: string) => 
      this.exchangeRateForm.controls.firstCurrencyValue.setValue(rate));
  }

  private getFormFieldValue(fieldName: string) {
    return this.exchangeRateForm.get(fieldName)?.getRawValue();
  }

}
