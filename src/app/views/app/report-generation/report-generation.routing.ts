import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportGenerationComponent } from './report-generation.component';
import { ReportSearchComponent } from './report-search/report-search.component';

const routes: Routes = [
    {
        path: '', component: ReportSearchComponent,
        children : [
          // { path: '', redirectTo:'', pathMatch: 'full' },
          // { path: '', component: ReportSearchComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportGenerationRoutingModule { }


