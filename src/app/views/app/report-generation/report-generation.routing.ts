import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportGenerationComponent } from './report-generation.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
    {
        path: '', component: ReportGenerationComponent,
        children : [
          { path: '', redirectTo:'reports', pathMatch: 'full' },
          { path: 'reports', component: ReportsComponent },
          { path: 'generation', loadChildren: () => import('./generation/generation.module').then(m => m.GenerationModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportGenerationRoutingModule { }


