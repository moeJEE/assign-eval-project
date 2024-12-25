import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            redirectTo: 'developer-dashboard',
            pathMatch: 'full',
        },
        {
            path: 'developer-dashboard',
            loadChildren: () =>
                import('./dev-dashboard/dev-dashboard.module').then(
                    (m) => m.DevDashboardModule
                ),
        },
        {
            path: 'pages',
            children: [
                {
                    path: 'projects',
                    loadChildren: () =>
                        import('./pages/projects/projects.module').then(
                            (m) => m.ProjectsModule
                        ),
                },
                {
                    path: 'my-profile',
                    loadChildren: () =>
                        import('./pages/profile/profile.module').then(
                            (m) => m.ProfileModule
                        ),
                },
            ],
        },
        { path: 'empty', loadChildren: () => import('./pages/empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./pages/timeline/timelinedemo.module').then(m => m.TimelineDemoModule) }
    ])],
    exports: [RouterModule]
})

export class DeveloperRoutingModule { }
