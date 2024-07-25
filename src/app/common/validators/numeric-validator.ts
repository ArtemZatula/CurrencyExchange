import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return isNaN(value) || value === null ? { 'nonNumeric': true } : null;
  };
}