import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'modal-filter-report', loadChildren: './pages/modal-filter-report/modal-filter-report.module#ModalFilterReportPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
   
  ],
  exports: [RouterModule]
})


export class AppRoutingModule { }
