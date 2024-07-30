import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { RatePayload } from '../models/rate-payload.type';
import { NotificationService } from '../common/services/notification.service';


@Injectable({
  providedIn: 'root'
})
export class ConversionHttpService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private host = 'https://v6.exchangerate-api.com/v6/47964c66a5b6558ae6f5e236/pair';


  loadExchangeRate(from: string, to: string, amount = 1): Observable<{rate: number, result: number}> {
    return this.http.get<RatePayload>(`${this.host}/${from}/${to}/${amount}`).pipe(
      catchError(e => {
        this.notificationService.notify('error', e.message);
        return EMPTY;
      }),
      map((res: RatePayload) => ({rate: res.conversion_rate, result: res.conversion_result}))
    )
  }
}
