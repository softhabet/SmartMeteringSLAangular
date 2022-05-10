import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportGenerationModule } from '../../report-generation.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ArchwizardModule } from 'angular-archwizard';
import { DndListModule } from 'ngx-drag-and-drop-lists';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FiltersModalComponent } from './step2/filters-modal/filters-modal.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({

  declarations: [Step1Component, Step2Component, Step3Component, FiltersModalComponent],
  entryComponents: [FiltersModalComponent],
  imports: [
    CommonModule,
    ReportGenerationModule,
    FormsModuleAngular,
    ReactiveFormsModule,
    TranslateModule,
    ArchwizardModule,
    ReportGenerationModule,
    DndListModule,
    NgSelectModule,
    ComponentsStateButtonModule,
    ModalModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TimepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    })
  ],
  exports: [Step1Component, Step2Component, Step3Component]
})
export class GenerationMeterModule { }
