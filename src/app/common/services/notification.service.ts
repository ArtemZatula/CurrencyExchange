import { Injectable } from '@angular/core';
import { delay, map, merge, Observable, shareReplay, Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification = new Subject<Notification | null>();

  getNotification(): Observable<Notification | null> {
    return merge(
      this.notification, 
      this.notification.pipe(
        delay(5000),
        map(() => null)
      )
    ).pipe(shareReplay());
  }

  notify(type: 'success' | 'error' | 'info' , message: string): void {
    this.notification.next({ type, message });
  }

  clear(): void {
    this.notification.next(null);
  }
}
