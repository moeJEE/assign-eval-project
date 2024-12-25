import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ValidateCodeModule } from './validate-code/validate-code.module'; // Import ValidateCodeModule

@NgModule({
    declarations: [RegisterComponent], // Declare only RegisterComponent
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        RegisterRoutingModule,
        ValidateCodeModule, // Import ValidateCodeModule here
    ],
})
export class RegisterModule {}
