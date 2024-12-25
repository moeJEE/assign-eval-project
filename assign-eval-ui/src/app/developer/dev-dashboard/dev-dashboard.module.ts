import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';

import { DevDashboardComponent } from './dev-dashboard.component';
import { DevDashboardRoutingModule } from './dev-dashboard-routing.module';

@NgModule({
  declarations: [
    DevDashboardComponent,
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    ChartModule,
    MenuModule, 
    TableModule,
    ButtonModule, 
    StyleClassModule, 
    PanelMenuModule,  
    DevDashboardRoutingModule,
  ],
})
export class DevDashboardModule { }
