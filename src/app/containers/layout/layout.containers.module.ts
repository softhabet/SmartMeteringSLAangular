import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { TopnavComponent } from './topnav/topnav.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ColorSwitcherComponent } from './color-switcher/color-switcher.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FooterComponent } from './footer/footer.component';
import { HeadingComponent } from './heading/heading.component';
import { ApplicationMenuComponent } from './application-menu/application-menu.component';
import { FormsModule } from '@angular/forms';
import { BreadcrumbReportsComponent } from './breadcrumb-reports/breadcrumb-reports.component';
import { BreadcrumbDetailsComponent } from './breadcrumb-details/breadcrumb-details.component';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [
    TopnavComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ColorSwitcherComponent,
    FooterComponent,
    HeadingComponent,
    ApplicationMenuComponent,
    BreadcrumbReportsComponent,
    BreadcrumbDetailsComponent
  ],
  imports: [
    AvatarModule,
    CommonModule,
    PerfectScrollbarModule,
    TranslateModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  exports: [
    TopnavComponent,
    SidebarComponent,
    BreadcrumbComponent,
    BreadcrumbReportsComponent,
    BreadcrumbDetailsComponent,
    ColorSwitcherComponent,
    FooterComponent,
    HeadingComponent,
    ApplicationMenuComponent
  ]
})
export class LayoutContainersModule { }
