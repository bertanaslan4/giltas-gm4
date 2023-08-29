import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductSelectProductPage } from './product-select-product.page';
import { BrMaskerModule } from 'br-mask';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ProductSelectProductPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductSelectProductPage]
})
export class ProductSelectProductPageModule {}
