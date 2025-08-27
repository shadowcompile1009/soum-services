import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'soumCertification'
})
export class SoumCertificationPipe implements PipeTransform {
  transform(value: any, returnType: 'class' | 'value'): string {
    if (!value) {
      switch (returnType) {
        case 'class':
          return 'hide-certification';

        case 'value':
          return '';

        default:
          return '';
      }
    }
    value = Number(value);
    if (value < 0) {
      switch (returnType) {
        case 'class':
          return 'hide-certification';

        case 'value':
          return '';

        default:
          return '';
      }
    }
    if (value >= 0 && value < 30) {
      switch (returnType) {
        case 'class':
          return 'extensive';

        case 'value':
          return 'soumCertification.extensive';

        default:
          return '';
      }
    }

    if (value >= 30 && value < 45) {
      switch (returnType) {
        case 'class':
          return 'usable';

        case 'value':
          return 'soumCertification.usable';

        default:
          return '';
      }
    }

    if (value >= 45 && value < 70) {
      switch (returnType) {
        case 'class':
          return 'good';

        case 'value':
          return 'soumCertification.good';

        default:
          return '';
      }
    }

    if (value >= 70 && value < 95) {
      switch (returnType) {
        case 'class':
          return 'great';

        case 'value':
          return 'soumCertification.great';

        default:
          return '';
      }
    }

    if (value >= 95) {
      switch (returnType) {
        case 'class':
          return 'excellent';

        case 'value':
          return 'soumCertification.excellent';

        default:
          return '';
      }
    }
  }
}
