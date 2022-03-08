import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportGenerationRoutingModule } from './report-generation.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ReportGenerationComponent} from './report-generation.component';
import { ReportsComponent } from './reports/reports.component';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { UiModalsContainersModule } from 'src/app/containers/ui/modals/ui.modals.containers.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ReportGenerationComponent, ReportsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportGenerationRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    CollapseModule,
    PagesContainersModule,
    //added for dropDown button
    ComponentsStateButtonModule,
    BootstrapModule,
    UiModalsContainersModule,
    LayoutContainersModule,
    FormsModuleAngular,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    })
  ]
})

export class ReportGenerationModule { }