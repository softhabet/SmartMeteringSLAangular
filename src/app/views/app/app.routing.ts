import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportGenerationComponent } from './report-generation/report-generation.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            { path: 'generated-reports', loadChildren: () => import('./generated-reports/generated-reports.module').then(m => m.GeneratedReportsModule) },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'report-generation', component: ReportGenerationComponent },
            { path: 'map', component: MapComponent }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
