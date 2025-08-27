import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgxPaginationModule } from "ngx-pagination";
import { PipesModule } from "src/app/pipes/pipes.module";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { UsersComponent } from "./users.component";

const routes: Routes = [
    {
        path: '', component: UsersComponent, children: [
            { path: 'admin/users/user-details', component: UserDetailsComponent  }
        ]
    }
]

@NgModule({
    declarations: [
        UserDetailsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        NgxPaginationModule,
        PipesModule
    ],
    exports: []
})
export class Usersmodule {

}