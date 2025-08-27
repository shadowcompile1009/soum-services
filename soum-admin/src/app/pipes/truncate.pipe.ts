import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, maxCharactersLength: number = 40): any {
    if (value.length <= maxCharactersLength) {
      return value;
    } else {
      return value.substring(0, maxCharactersLength) + '...';
    }
  }

}
