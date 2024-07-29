import { inject, Injectable, signal } from '@angular/core';
import { EMPTY, map, Observable, of, tap } from 'rxjs';
import { ConversionHttpService } from './conversion-http.service';
import { ConversionRate } from '../models/rate.type';


@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  private conversionHttpService = inject(ConversionHttpService);
  private rates = signal<ConversionRate[]>([]);

  getExchangeRate(from: string, to: string, amount = 1): Observable<string> {
    if (!isNaN(+amount)) {
      const rate = this.rates().find((r: ConversionRate) => 
        [r.from, r.to].includes(from) && [r.from, r.to].includes(to));
  
      if (!rate) {
        return this.conversionHttpService.loadExchangeRate(from, to, amount).pipe(
          tap(({ rate }) => this.setExchangeRate(from, to, rate)),
          map(({ result }) => `${result}`)
        );
      } else if (rate.from === from) {
        return of((rate.rate * amount).toFixed(4));
      }
      return of((amount / rate.rate).toFixed(4));
    }

    return EMPTY
  }

  setExchangeRate(from: string, to: string, rate: number): void {
    this.rates.update(rates => [...rates, {from, to, rate}])
  }
}
