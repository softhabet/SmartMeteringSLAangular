import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'report-generation', loadChildren: () => import('./report-generation/report-generation.module').then(m => m.ReportGenerationModule) },
            { path: 'generated-reports', loadChildren: () => import('./generated-reports/generated-reports.module').then(m => m.GeneratedReportsModule) },
            { path: 'map', loadChildren: () => import('./map/map.module').then(m => m.MapModule) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
