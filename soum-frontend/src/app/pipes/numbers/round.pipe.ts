import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundNumbers'
})
export class RoundPipe implements PipeTransform {
  transform(value: any): number {
    return Math.ceil(value);
  }
}
