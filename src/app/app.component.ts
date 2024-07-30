import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ConversionComponent } from './components/conversion/conversion.component';
import { NotificationComponent } from './common/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ConversionComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
