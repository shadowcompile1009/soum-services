import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(url: string): string {
    if (url.includes('https://')) {
      return url;
    } else {
      return 'https://' + url;
    }
  }

}
