import { DestroyRef, Directive, ElementRef, Inject, inject, InjectionToken, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { ControlErrorComponent } from '../components/control-error/control-error.component';

const errorMessageTxt: {
  [key: string]: (params?: any) => string;
} = {
  required: () => 'Required',
  nonNumeric: () => 'Wrong format'
};

const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => errorMessageTxt
});

@Directive({
  selector: '[controlError]',
  standalone: true
})
export class ControlErrorDirective {
  private destroyRef = inject(DestroyRef);
  private viewContainerRef = inject(ViewContainerRef);

  constructor(
    @Self() private control: NgControl,
    @Inject(FORM_ERRORS) private errors: any,
  ) { }

  ngOnInit() {
    this.control.statusChanges!.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.viewContainerRef.clear();
      const controlErrors = this.control.errors;
      if (controlErrors) {
        const firstErrorName = Object.keys(controlErrors)[0];
        const getError = this.errors[firstErrorName];
        if (getError) {
          const text = getError(controlErrors[firstErrorName]);
          const ref = this.viewContainerRef.createComponent(ControlErrorComponent);
          ref.setInput('errorText', text);
        }
      }
    });
  }

}


