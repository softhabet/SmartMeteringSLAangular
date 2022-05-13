import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KibanaComponent } from './kibana/kibana.component';
import { LeafletComponent } from './leaflet/leaflet.component';
import { MapComponent } from './map.component';

const routes: Routes = [
    {
        path: '', component: MapComponent,
        children : [
          { path: '', redirectTo: 'kibana', pathMatch: 'full' },
          { path: 'kibana', component: KibanaComponent },
          { path: 'leaflet', component: LeafletComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MapRoutingModule { }


