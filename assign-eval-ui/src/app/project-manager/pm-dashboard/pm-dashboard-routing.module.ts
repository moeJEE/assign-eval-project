import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmDashboardComponent } from './pm-dashboard.component';

const routes: Routes = [
  { path: '', component: PmDashboardComponent }, // Default path for the module
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmDashboardsRoutingModule {}
