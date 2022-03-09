import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportGenerationModule } from '../../report-generation.module';
import { PaginationModule } from 'ngx-bootstrap';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FormsModule as FormsModuleAngular } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ArchwizardModule } from 'angular-archwizard';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';


@NgModule({
  declarations: [Step1Component, Step2Component, Step3Component],
  imports: [
    CommonModule,
    ReportGenerationModule,
    FormsModuleAngular,
    TranslateModule,
    ArchwizardModule,
    ReportGenerationModule,
    PaginationModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    })
  ]
})
export class GenerationMeterModule { }
