import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RatePayload } from '../models/rate-payload.type';


@Injectable({
  providedIn: 'root'
})
export class ConversionHttpService {
  private http = inject(HttpClient);
  private host = 'https://v6.exchangerate-api.com/v6/47964c66a5b6558ae6f5e236/pair';

  loadExchangeRate(from: string, to: string, amount = 1): Observable<{rate: number, result: number}> {
    return this.http.get<RatePayload>(`${this.host}/${from}/${to}/${amount}`).pipe(
      map((res: RatePayload) => ({rate: res.conversion_rate, result: res.conversion_result}))
    )
  }
}
