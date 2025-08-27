import { NgModule } from '@angular/core';
import { ImagePipe } from './image/image.pipe';
import { MaskPipe } from './mask-card-number/mask-card-number.pipe';
import { DecryptPipe } from './decrypt/decrypt.pipe';
import { SoumCertificationPipe } from './soum-certification/soum-certification.pipe';
import { RoundPipe } from './numbers/round.pipe';
import { ImagePathPipe } from './imagePath/image-path.pipe';

@NgModule({
  declarations: [
    ImagePipe,
    MaskPipe,
    DecryptPipe,
    SoumCertificationPipe,
    RoundPipe,
    ImagePathPipe
  ],
  exports: [ImagePipe, MaskPipe, DecryptPipe, SoumCertificationPipe, RoundPipe, ImagePathPipe]
})
export class PipesModule {}
