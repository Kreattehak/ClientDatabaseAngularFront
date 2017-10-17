import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ClientListComponent} from './clients/client-list.component';
import {ClientFormComponent} from './clients/client-form.component';
import {ClientDetailComponent} from './clients/client-detail.component';
import {AboutUsComponent} from './utils/about-us.component';
import {PathNotFoundComponent} from './utils/path-not-found.component';
import {AddressDetailResolver} from './addresses/address-detail-resolver.service';
import {ClientDetailResolver} from './clients/client-detail-resolver.service';
import {AddressDetailComponent} from './addresses/address-detail.component';
import {CanActivateAuthGuard} from './login/can-activate-authguard';
import {LoginComponent} from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: 'clients', component: ClientListComponent},
      {path: 'clients/new', component: ClientFormComponent, canActivate: [CanActivateAuthGuard]},
      {
        path: 'clients/:id/details',
        component: ClientDetailComponent,
        resolve: {
          client: ClientDetailResolver,
          addresses: AddressDetailResolver
        },
        canActivate: [CanActivateAuthGuard]
      },
      {
        path: 'clients/:id',
        component: ClientFormComponent,
        resolve: {client: ClientDetailResolver},
        canActivate: [CanActivateAuthGuard]
      },
      {
        path: 'clients/:id/address/:addressId',
        component: AddressDetailComponent,
        resolve: {
          addresses: AddressDetailResolver,
          client: ClientDetailResolver
        },
        canActivate: [CanActivateAuthGuard]
      },
      {
        path: 'clients/:id/newAddress',
        component: AddressDetailComponent,
        canActivate: [CanActivateAuthGuard]
      },
      {path: 'aboutUs', component: AboutUsComponent, outlet: 'messages'},
      {path: 'login', component: LoginComponent},
      {path: '', redirectTo: 'clients', pathMatch: 'full'},
      {path: '**', component: PathNotFoundComponent},
    ]),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
