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
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ReportTableComponent } from './report-table/report-table.component';


@NgModule({
  declarations: [GeneratedReportsComponent, ReportTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    GeneratedReportsRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    CollapseModule,
    PagesContainersModule,
    BootstrapModule,
    ComponentsStateButtonModule,
    FormsModuleAngular,
    SimpleNotificationsModule.forRoot(),
    PaginationModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    })
  ]
})

export class GeneratedReportsModule { }
