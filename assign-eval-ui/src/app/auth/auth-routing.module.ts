import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from '@app/core/guards/LoggedInGuard';

const routes: Routes = [
    { 
        path: 'login', 
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
        canActivate: [LoggedInGuard]
    },
    { 
        path: 'register', 
        loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
        canActivate: [LoggedInGuard]
    },
    { 
        path: 'error', 
        loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule) 
    },
    { 
        path: 'access', 
        loadChildren: () => import('./pages/access/access.module').then(m => m.AccessModule) 
    },
    { 
        path: '**', 
        redirectTo: 'error' 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }