import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapRoutingModule } from './map.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { MapComponent} from './map.component';
import { KibanaComponent } from './kibana/kibana.component';
import { LeafletComponent } from './leaflet/leaflet.component';
import { NgxSpinnerModule } from 'ngx-bootstrap-spinner';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MapComponent, KibanaComponent, LeafletComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    CollapseModule,
    PagesContainersModule,
    NgxSpinnerModule,
    BootstrapModule,
    FormsModule,
    PaginationModule.forRoot()
  ]
})
export class MapModule { }
