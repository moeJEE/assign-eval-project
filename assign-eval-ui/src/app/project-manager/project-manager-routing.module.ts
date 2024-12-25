import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            redirectTo: 'project-manager-dashboard',
            pathMatch: 'full',
        },
        {
            path: 'project-manager-dashboard',
            loadChildren: () =>
                import('./pm-dashboard/pm-dashboard.module').then(
                    (m) => m.PmDashboardModule
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
                    path: 'developers',
                    loadChildren: () =>
                        import('./pages/developers/developers.module').then(
                            (m) => m.DevelopersModule
                        ),
                },
            ],
        },
        { path: 'empty', loadChildren: () => import('./pages/empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./pages/timeline/timelinedemo.module').then(m => m.TimelineDemoModule) }
    ])],
    exports: [RouterModule]
})

export class ProjectManagerRoutingModule { }
