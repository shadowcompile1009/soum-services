import { AbstractControl, ValidatorFn } from '@angular/forms';

/*
 * this function used to validate the input string as url or not
 * i'm using this validation when we set REGA link in spp in real state feature
 * and this urlPattern for checking URL valid url or not
 */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const urlPattern = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+:)*([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+@)?(?!-)(([a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)*[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,63}|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?(\/([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)*(\?([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?$/;
    const valid = urlPattern.test(control.value);
    return valid ? null : { invalidUrl: { value: control.value } };
  };
}

// Validate Pdf links
export function pdfUrlValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const pdfUrlPattern = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+:)*([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+@)?(?!-)(([a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)*[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,63}|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?(\/([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)*(\?([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?\.pdf$/i;
    const valid = pdfUrlPattern.test(control.value);
    return valid ? null : { invalidUrl: { value: control.value } };
  };
}
