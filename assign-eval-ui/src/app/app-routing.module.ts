import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'project-manager-dashboard',
        loadChildren: () =>
          import('./project-manager/pm-dashboard/pm-dashboard.module').then(
            (m) => m.PmDashboardModule
          ),
        canActivate: [AuthGuard],
        data: { roles: ['PROJECT_MANAGER'] },
      },
      {
        path: 'developer-dashboard',
        loadChildren: () =>
          import('./developer/dev-dashboard/dev-dashboard.module').then(
            (m) => m.DevDashboardModule
          ),
        canActivate: [AuthGuard],
        data: { roles: ['DEVELOPER'] },
      },
      {
        path: 'project-manager',
        loadChildren: () =>
          import('./project-manager/project-manager.module').then(
            (m) => m.ProjectManagerModule
          ),
        canActivate: [AuthGuard],
        data: { roles: ['PROJECT_MANAGER'] },
      },
      {
        path: 'developer',
        children: [
          {
            path: 'projects',
            loadChildren: () =>
              import('./developer/pages/projects/projects.module').then(
                (m) => m.ProjectsModule
              ),
            canActivate: [AuthGuard],
            data: { roles: ['DEVELOPER'] },
          },
          {
            path: 'my-profile',
            loadChildren: () =>
              import('./developer/pages/profile/profile.module').then(
                (m) => m.ProfileModule
              ),
            canActivate: [AuthGuard],
            data: { roles: ['DEVELOPER'] },
          },
        ],
      },
      {
        path: 'pm-pages',
        children: [
          {
            path: 'developers',
            loadChildren: () =>
              import('./project-manager/pages/developers/developers.module').then(
                (m) => m.DevelopersModule
              ),
            canActivate: [AuthGuard],
            data: { roles: ['PROJECT_MANAGER'] },
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
