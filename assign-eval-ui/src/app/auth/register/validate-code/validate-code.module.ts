import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ValidateCodeComponent } from './validate-code.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    declarations: [ValidateCodeComponent],
    imports: [
        CommonModule,
        FormsModule, // Add FormsModule
        ButtonModule,
        InputTextModule
    ],
    exports: [ValidateCodeComponent]
})
export class ValidateCodeModule {}
