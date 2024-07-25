import { Component, inject } from '@angular/core';
import { ConversionService } from '../../services/conversion.service';
import { AsyncPipe } from '@angular/common';
import { forkJoin, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private conversionService = inject(ConversionService);

  exchangeRate$ = forkJoin(
    ['USD', 'EUR'].map(currency => 
      this.conversionService.getExchangeRate(currency, 'UAH', 1).pipe(
        map(rate => [currency, rate]),
        shareReplay())
  ));

}
