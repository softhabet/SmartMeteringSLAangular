import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportGenerationComponent } from './report-generation/report-generation.component';
import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [AppComponent, DashboardComponent, ReportGenerationComponent, MapComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule
  ]
})
export class AppModule { }

