import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalFilterReportPage } from './modal-filter-report.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFilterReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalFilterReportPage]
})
export class ModalFilterReportPageModule {}
