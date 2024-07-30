import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; 
import { merge } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ConversionService } from '../../services/conversion.service';
import { CurrencyGroupComponent } from '../../common/components/currency-group/currency-group.component';

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyGroupComponent],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.scss'
})
export class ConversionComponent implements AfterViewInit {
  private conversionService = inject(ConversionService);
  private destroyRef = inject(DestroyRef);

  currencies = ['USD', 'EUR', 'UAH', 'NZD', 'CAD', 'SAR'];
  currencyFormGroup = inject(FormBuilder).group({});

  ngAfterViewInit() {
    const getCurrencyForm = (controlKey: string) => this.currencyFormGroup.get(controlKey) as FormGroup;

    const currencyChange$ = (sourceKey: string, targetKey: string) => 
      getCurrencyForm(sourceKey)?.valueChanges.pipe(
        map(formValues => [formValues, getCurrencyForm(targetKey)])
      );

    merge(
      currencyChange$('firstCurrency', 'secondCurrency'),
      currencyChange$('secondCurrency', 'firstCurrency')
    ).pipe(
      debounceTime(300),
      switchMap(([values, currencyGroupToUpdate]) => 
        this.conversionService.getExchangeRate(values.name, currencyGroupToUpdate.value.name, values.rate).pipe(
          tap((result: string) => currencyGroupToUpdate.get('rate').setValue(result, {emitEvent: false}))
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
