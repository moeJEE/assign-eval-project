import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PmDashboardComponent } from './pm-dashboard.component';
import { PmDashboardsRoutingModule } from './pm-dashboard-routing.module';
import { AvatarModule } from 'primeng/avatar';

@NgModule({
  declarations: [PmDashboardComponent],
  imports: [
    AvatarModule,
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    ButtonModule,
    StyleClassModule,
    PanelMenuModule,
    PmDashboardsRoutingModule,
  ],
})
export class PmDashboardModule {
  constructor() {
    console.log('PmDashboardModule loaded');
  }
}
