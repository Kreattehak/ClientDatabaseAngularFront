import {ROUTES} from './app.routes';
import {ClientListComponent} from './clients/client-list.component';

describe('ROUTES', () => {

  it('should contain a route for /clients', () => {
    expect(ROUTES).toContain({path: 'clients', component: ClientListComponent});
  });
});
