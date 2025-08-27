import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function compareValuesValidator(minControlName: string, maxControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const minControl = formGroup.get(minControlName);
    const maxControl = formGroup.get(maxControlName);

    if (!minControl || !maxControl) {
      return null;
    }

    const minValue = minControl.value;
    const maxValue = maxControl.value;

    if (minValue === 0 || maxValue === 0) {
      if (!maxControl.hasError('compareValues')) {
        maxControl.setErrors({ shouldbelargerthanzero: true });
      }
      return { shouldbelargerthanzero: true }
    } else if (minValue !== null && maxValue !== null && minValue > maxValue) {
      if (!maxControl.hasError('compareValues')) {
        maxControl.setErrors({ compareValues: true });
      }
      return { compareValues: true };
    } else {
      if (maxControl.hasError('compareValues')) {
        maxControl.setErrors(null);
      }
      if (maxControl.hasError('shouldbelargerthanzero')) {
        maxControl.setErrors(null);
      }

      return null;
    }
  };
}
