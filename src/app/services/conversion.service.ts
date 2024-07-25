import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  private http = inject(HttpClient);
  private host = 'https://v6.exchangerate-api.com/v6/47964c66a5b6558ae6f5e236/pair';

  getExchangeRate(from: string, to: string, amount = 1) {
    return this.http.get(`${this.host}/${from}/${to}/${amount}`).pipe(
      map((res: any) => res.conversion_result)
    )
  }
}
