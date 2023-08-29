import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProposalPage } from './proposal.page';
import { BrMaskerModule } from 'br-mask';
import { TranslateModule } from '@ngx-translate/core';
import { HideheaderDirective } from "src/app/directives/hideheader.directive";

const routes: Routes = [
  {
    path: '',
    component: ProposalPage
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
  declarations: [ProposalPage, HideheaderDirective]
})
export class ProposalPageModule {}
