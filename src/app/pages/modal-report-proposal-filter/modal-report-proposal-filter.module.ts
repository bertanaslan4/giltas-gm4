import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalReportProposalFilterPage } from './modal-report-proposal-filter.page';

const routes: Routes = [
  {
    path: '',
    component: ModalReportProposalFilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalReportProposalFilterPage]
})
export class ModalReportProposalFilterPageModule {}
