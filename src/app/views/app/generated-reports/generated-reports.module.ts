import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneratedReportsRoutingModule } from './generated-reports.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { GeneratedReportsComponent } from './generated-reports.component';
import { DatatableComponent } from './datatable/datatable.component';


@NgModule({
  declarations: [GeneratedReportsComponent, DatatableComponent],
  imports: [
    CommonModule,
    SharedModule,
    GeneratedReportsRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    CollapseModule,
    PagesContainersModule,
    PaginationModule.forRoot()
  ]
})

export class GeneratedReportsModule { }
