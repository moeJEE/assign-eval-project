import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevDashboardComponent } from './dev-dashboard.component';

/**
 * Routes configuration for the Developer Dashboard module.
 */
const routes: Routes = [
  {
    path: '',
    component: DevDashboardComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class DevDashboardRoutingModule {}
