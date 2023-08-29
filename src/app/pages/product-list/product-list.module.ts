

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import { ProductListPage } from './product-list.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ProductListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    RouterModule.forChild(routes),
    TranslateModule
    
  ],
  declarations: [ProductListPage]
})
export class ProductListPageModule {}
