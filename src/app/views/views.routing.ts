import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewsComponent } from './views.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './../shared/auth.guard';
import { environment } from './../../environments/environment';

let routes: Routes = [
  {
    path: '',
    component: ViewsComponent,
    pathMatch: 'full',
  },
  { path: 'app', loadChildren: () => import('./app/app.module').then(m => m.AppModule), canActivate: [AuthGuard] },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/error' }
];

if (!environment.isAuthGuardActive) {
  routes = [
    {
      path: '',
      component: ViewsComponent,
      pathMatch: 'full',
    },
    { path: 'app', loadChildren: () => import('./app/app.module').then(m => m.AppModule) },
    { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: '/error' }
  ];
}
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }
