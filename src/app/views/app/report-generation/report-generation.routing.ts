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
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportGenerationRoutingModule { }


