import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalAddAddressPage } from './modal-add-address.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { BrMaskerModule } from 'br-mask';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ModalAddAddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
    BrMaskerModule,
    TranslateModule
  ],
  declarations: [ModalAddAddressPage]
})
export class ModalAddAddressPageModule {}
