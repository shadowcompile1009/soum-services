import { TradeinDetailsComponent } from './tradein-details/tradein-details.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgxPaginationModule } from "ngx-pagination";
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { TradeInsComponent } from "./trade-ins.component";

const routes: Routes = [
  {
    path: '', component: TradeInsComponent, children: [
      { path: 'admin/trade-in/details', component: TradeinDetailsComponent }
    ]
  }
]

@NgModule({
  declarations: [
    TradeInsComponent,
    TradeinDetailsComponent
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
export class TradeInsModule { }
