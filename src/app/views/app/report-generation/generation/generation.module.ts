import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerationRoutingModule } from './generation.routing';
import { ReportGenerationModule } from '../report-generation.module';
import { GenerationMeterModule } from './generation-meter/generation-meter.module';
import { PaginationModule } from 'ngx-bootstrap';
import { ContextMenuModule } from 'ngx-contextmenu';
import { GenerationMeterComponent } from './generation-meter/generation-meter.component';
import { GenerationEventComponent } from './generation-event/generation-event.component';
import { GenerationComponent } from './generation.component';
import { FormsModule as FormsModuleAngular } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ArchwizardModule } from 'angular-archwizard';


@NgModule({
  declarations: [GenerationMeterComponent, GenerationEventComponent, GenerationComponent],
  imports: [
    CommonModule,
    GenerationRoutingModule,
    ReportGenerationModule,
    GenerationMeterModule,
    FormsModuleAngular,
    TranslateModule,
    ArchwizardModule,
    PaginationModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    })
  ]
})
export class GenerationModule { }
