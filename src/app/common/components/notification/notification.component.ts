import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  private notificationService = inject(NotificationService)

  notification = this.notificationService.getNotification();

  clearNotification(): void {
    this.notificationService.clear();
  }
}




