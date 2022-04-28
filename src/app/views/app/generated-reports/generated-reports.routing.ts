import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstanceTableComponent } from './instance-table/instance-table.component';
import { GeneratedReportsComponent } from './generated-reports.component';

const routes: Routes = [
    {
        path: '', component: InstanceTableComponent,
        // children : [
        //   { path: '', redirectTo: 'blog-list', pathMatch: 'full' },
        // ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneratedReportsRoutingModule { }


