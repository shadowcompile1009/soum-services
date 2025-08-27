import { NgModule } from "@angular/core";
import { DecryptPipe } from "./decrypt/decrypt.pipe";
import { MaskPipe } from "./mask/mask.pipe";
import { ImagePipe } from './image/image.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
    declarations: [
        DecryptPipe,
        MaskPipe,
        ImagePipe,
        TruncatePipe,
    ],
    exports: [
        DecryptPipe,
        MaskPipe,
        ImagePipe,
        TruncatePipe,
    ]
})

export class PipesModule {

}
