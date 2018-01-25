import {ROUTES} from '../app/app.routes';
import {ClientListComponent} from '../app/clients/client-list.component';
import {ClientFormComponent} from '../app/clients/client-form.component';
import {PathNotFoundComponent} from '../app/utils/path-not-found.component';
import {CanActivateAuthGuard} from '../app/login/can-activate-authguard';
import {ClientDetailComponent} from '../app/clients/client-detail.component';
import {ClientDetailResolver} from '../app/clients/client-detail-resolver.service';
import {AddressDetailResolver} from '../app/addresses/address-detail-resolver.service';
import {AddressFormComponent} from '../app/addresses/address-form.component';
import {AboutAuthorComponent} from '../app/utils/about-author.component';
import {LoginComponent} from '../app/login/login.component';

describe('ROUTES', () => {

  it('should contain a route for /clients', () => {
    expect(ROUTES).toContain({path: 'clients', component: ClientListComponent});
  });

  it('should contain a route for /clients/new', () => {
    expect(ROUTES).toContain({
      path: 'clients/new', component: ClientFormComponent,
      canActivate: [CanActivateAuthGuard]
    });
  });

  it('should contain a route for /clients/someId/details', () => {
    expect(ROUTES).toContain({
      path: 'clients/:id/details',
      component: ClientDetailComponent,
      resolve: {
        client: ClientDetailResolver,
        addresses: AddressDetailResolver
      },
      canActivate: [CanActivateAuthGuard]
    });
  });

  it('should contain a route for /clients/someId', () => {
    expect(ROUTES).toContain({
      path: 'clients/:id',
      component: ClientFormComponent,
      resolve: {client: ClientDetailResolver},
      canActivate: [CanActivateAuthGuard]
    });
  });

  it('should contain a route for /clients/someId/address/someAddressId', () => {
    expect(ROUTES).toContain({
      path: 'clients/:id/address/:addressId',
      component: AddressFormComponent,
      resolve: {
        addresses: AddressDetailResolver,
        client: ClientDetailResolver
      },
      canActivate: [CanActivateAuthGuard]
    });
  });

  it('should contain a route for /clients/someId/newAddress', () => {
    expect(ROUTES).toContain({
      path: 'clients/:id/newAddress',
      component: AddressFormComponent,
      canActivate: [CanActivateAuthGuard]
    });
  });

  it('should contain a route for /aboutAuthor', () => {
    expect(ROUTES).toContain({
      path: 'aboutAuthor',
      component: AboutAuthorComponent, outlet: 'messages'
    });
  });

  it('should contain a route for /aboutAuthor', () => {
    expect(ROUTES).toContain({path: 'login', component: LoginComponent});
  });

  it('should redirect to PathNotFoundComponent for any other routes', () => {
    expect(ROUTES).toContain({path: '**', component: PathNotFoundComponent});
  });

  it('should redirect to ClientListComponent from empty path, with fully matched path', () => {
    expect(ROUTES).toContain({path: '', redirectTo: 'clients', pathMatch: 'full'});
  });
});
