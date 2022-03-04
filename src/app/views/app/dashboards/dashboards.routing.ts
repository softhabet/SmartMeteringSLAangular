import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';

const routes: Routes = [
    {
        path: '', component: DashboardsComponent,
        children : [
          // { path: '', redirectTo:'search', pathMatch: 'full' },
          // { path: 'search', component: ReportSearchComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }


