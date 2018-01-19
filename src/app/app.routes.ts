import {ClientListComponent} from './clients/client-list.component';
import {ClientFormComponent} from './clients/client-form.component';
import {ClientDetailComponent} from './clients/client-detail.component';
import {AddressDetailResolver} from './addresses/address-detail-resolver.service';
import {ClientDetailResolver} from './clients/client-detail-resolver.service';
import {CanActivateAuthGuard} from './login/can-activate-authguard';
import {PathNotFoundComponent} from './utils/path-not-found.component';
import {LoginComponent} from './login/login.component';
import {AboutAuthorComponent} from './utils/about-author.component';
import {AddressFormComponent} from './addresses/address-form.component';

export const ROUTES = [
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
    component: AddressFormComponent,
    resolve: {
      addresses: AddressDetailResolver,
      client: ClientDetailResolver
    },
    canActivate: [CanActivateAuthGuard]
  },
  {
    path: 'clients/:id/newAddress',
    component: AddressFormComponent,
    canActivate: [CanActivateAuthGuard]
  },
  {path: 'aboutAuthor', component: AboutAuthorComponent, outlet: 'messages'},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'clients', pathMatch: 'full'},
  {path: '**', component: PathNotFoundComponent},
];
