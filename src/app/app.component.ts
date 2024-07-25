import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ConversionComponent } from './components/conversion/conversion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ConversionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
