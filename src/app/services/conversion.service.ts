import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { ConversionHttpService } from './conversion-http.service';
import { ConversionRate } from '../models/rate.type';


@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  private conversionHttpService = inject(ConversionHttpService);
  private rates = signal<ConversionRate[]>([]);

  getExchangeRate(from: string, to: string, amount = 1): Observable<number> {
    const rate = this.rates().find((r: ConversionRate) => r.from === from && r.to === to)?.rate;

    if (!rate) {
      return this.conversionHttpService.loadExchangeRate(from, to, amount).pipe(
        tap(({ rate }) => this.setExchangeRate(from, to, rate)),
        map(({ result }) => result)
      );
    }

    return of(rate * amount);
  }

  setExchangeRate(from: string, to: string, rate: number): void {
    this.rates.update(rates => [...rates, {from, to, rate}])
  }
}
