import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagePath'
})
export class ImagePathPipe implements PipeTransform {

  transform(imageName: string, fileName?: string): string {
    const BaseImagePath: string = '../../../assets/images/';
    const ImagePath = fileName ? BaseImagePath+fileName+"/"+imageName : BaseImagePath+imageName;
    return ImagePath;
  }

}
