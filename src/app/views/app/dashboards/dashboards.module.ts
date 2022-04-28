import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardsRoutingModule } from './dashboards.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { DashboardsComponent} from './dashboards.component';


@NgModule({
  declarations: [DashboardsComponent],
  imports: [
    CommonModule,
    SharedModule,
    DashboardsRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    CollapseModule,
    PagesContainersModule,
    PaginationModule.forRoot()
  ]
})
export class DashboardsModule { }
