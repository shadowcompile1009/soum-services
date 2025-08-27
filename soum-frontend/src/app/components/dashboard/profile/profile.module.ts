import { SharedModule } from 'src/app/shared-components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AboutSoumComponent } from './about-soum/about-soum.component';
import { QuestionHeadersComponent } from './question-headers/question-headers.component';
import { QuestionTileComponent } from './question-headers/question-tile/question-tile.component';
import { QuestionCategoryComponent } from './question-headers/question-category/question-category.component';
import { MaterialModule } from 'src/app/shared-components/material-components/material.module';
const routes: Routes = [
  // { path: 'profile/add-address', component: AddAddressComponent },
  // { path: 'profile/add-bank', component: BankDetailComponent },
  // { path: 'profile/add-card', component: AddCardComponent }
];

@NgModule({
    declarations: [
        // AddCardComponent,
        // AddAddressComponent,
        // BankDetailComponent,
        AboutSoumComponent,
        QuestionHeadersComponent,
        QuestionTileComponent,
        QuestionCategoryComponent,
    ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PipesModule,
    ClipboardModule,
    SharedModule,
    MaterialModule
  ],
  exports: [RouterModule]
})
export class ProfileModule {}
