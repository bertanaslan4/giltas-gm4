import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrMaskerModule } from 'br-mask'; 

import { IonicModule } from '@ionic/angular';

import { ModalGuarantorPage } from './modal-guarantor.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ModalGuarantorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [ModalGuarantorPage]
})
export class ModalGuarantorPageModule {}
