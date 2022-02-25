import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatatableComponent } from './datatable/datatable.component';
import { GeneratedReportsComponent } from './generated-reports.component';

const routes: Routes = [
    {
        path: '', component: DatatableComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneratedReportsRoutingModule { }


