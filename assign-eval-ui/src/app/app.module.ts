import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ApiModule, Configuration } from './api';
import { ProductService } from './core/services/product.service';
import { CountryService } from './core/services/country.service';
import { CustomerService } from './core/services/customer.service';
import { EventService } from './core/services/event.service';
import { IconService } from './core/services/icon.service';
import { NodeService } from './core/services/node.service';
import { PhotoService } from './core/services/photo.service';

export function apiConfigFactory(): Configuration {
    return new Configuration({
        basePath: 'http://localhost:8088/api/v1',
        accessToken: () => sessionStorage.getItem('authToken') || '',
    });
}

@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ApiModule.forRoot(apiConfigFactory),
        AppRoutingModule,
        AppLayoutModule,
        TableModule,
        CommonModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        FormsModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
    ],
    bootstrap: [AppComponent],
})

export class AppModule {}
