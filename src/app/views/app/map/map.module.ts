import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapRoutingModule } from './map.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { MapComponent} from './map.component';



@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    SharedModule,
    MapRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    CollapseModule,
    PagesContainersModule,
    PaginationModule.forRoot()
  ]
})
export class MapModule { }
