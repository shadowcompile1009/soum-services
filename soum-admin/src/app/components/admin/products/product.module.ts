import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgxPaginationModule } from "ngx-pagination";
import { AdminLogsComponent } from "./admin-logs/admin-logs.component";
import { BrowserModule } from '@angular/platform-browser';
import { ProductsComponent } from "./products.component";
import {MatInputModule} from '@angular/material/input';
import { LockedUserComponent } from './locked-user/locked-user.component';

const routes: Routes = [
    {
        path: '', component: ProductsComponent, children: [
            { path: 'admin/products/admin-logs', component: AdminLogsComponent  }
        ]
    }
]

@NgModule({
    declarations: [
    AdminLogsComponent,
    LockedUserComponent,
    ],
    imports: [
    CommonModule,
        BrowserModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule
    ],
    exports: [
    ]
})
export class Productsmodule {}
