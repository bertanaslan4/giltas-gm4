import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalProposalReceiptPage } from './modal-proposal-receipt.page';

const routes: Routes = [
  {
    path: '',
    component: ModalProposalReceiptPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalProposalReceiptPage]
})
export class ModalProposalReceiptPageModule {}
