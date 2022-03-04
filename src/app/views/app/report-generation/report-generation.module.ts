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
import { ReportSearchComponent } from './report-search/report-search.component';


@NgModule({
  declarations: [ReportGenerationComponent, ReportSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportGenerationRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    CollapseModule,
    PagesContainersModule,
    PaginationModule.forRoot()
  ]
})

export class ReportGenerationModule { }
