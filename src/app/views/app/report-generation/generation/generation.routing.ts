import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerationComponent } from './generation.component';
import { GenerationMeterComponent } from './generation-meter/generation-meter.component';
import { GenerationEventComponent } from './generation-event/generation-event.component';

const routes: Routes = [
    {
      path: '', component: GenerationComponent,
        children : [
          { path: '', redirectTo:'meter', pathMatch: 'full' },
          { path: 'meter', component: GenerationMeterComponent },
          { path: 'event', component: GenerationEventComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenerationRoutingModule { }


