import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneratedReportsComponent } from './generated-reports.component';
import { InstanceTableComponent } from './instance-table/instance-table.component';
import { InstancesComponent } from './instances/instances.component';
import { ReportInstancesComponent } from './report-instances/report-instances.component';

const routes: Routes = [
    {
        path: '', component: GeneratedReportsComponent,
        children : [
          { path: '', component: InstancesComponent },
          { path: ':reportName', component: ReportInstancesComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneratedReportsRoutingModule { }


