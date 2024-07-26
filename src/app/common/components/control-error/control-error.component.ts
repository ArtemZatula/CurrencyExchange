import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  template: '<div class="error">{{ errorText }}</div>',
  styles: `:host {
    color: var(--orange-red);
    grid-row: 2;
  }`
})
export class ControlErrorComponent {
  @Input() errorText: string | undefined;
}
