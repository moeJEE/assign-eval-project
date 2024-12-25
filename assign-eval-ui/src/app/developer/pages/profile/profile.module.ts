import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileDetailsComponent,
  ],
  imports: [
    CheckboxModule,
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    DialogModule,
    MultiSelectModule,
    AvatarModule,
    AvatarGroupModule,
    TooltipModule,
    BreadcrumbModule,
    ChipModule,
    TimelineModule,
  ],
})
export class ProfileModule {}
