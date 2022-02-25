import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportTableComponent } from './report-table/report-table.component';
import { GeneratedReportsComponent } from './generated-reports.component';

const routes: Routes = [
    {
        path: '', component: ReportTableComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneratedReportsRoutingModule { }


