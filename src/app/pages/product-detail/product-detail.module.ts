import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router'; 
import { IonicModule } from '@ionic/angular'; 
import { ProductDetailPage } from './product-detail.page';   
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [ProductDetailPage]  
})
export class ProductDetailPageModule {}
