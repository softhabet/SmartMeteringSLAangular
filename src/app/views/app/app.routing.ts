import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportGenerationComponent } from './report-generation/report-generation.component';
import { GeneratedReportsComponent } from './generated-reports/generated-reports.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'applications', loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule) },
            { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
            { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
            { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
            { path: 'blank-page', component: BlankPageComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'report-generation', component: ReportGenerationComponent },
            { path: 'generated-reports', component: GeneratedReportsComponent },
            { path: 'map', component: MapComponent }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
