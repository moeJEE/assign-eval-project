import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register.component';
import { ValidateCodeComponent } from './validate-code/validate-code.component';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'validate-code', component: ValidateCodeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
