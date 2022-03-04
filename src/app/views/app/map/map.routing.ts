import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map.component';

const routes: Routes = [
    {
        path: '', component: MapComponent,
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
export class MapRoutingModule { }


