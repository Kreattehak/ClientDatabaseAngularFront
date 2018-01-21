import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Client} from './client';
import {ClientService} from './client.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ClientListResolver implements Resolve<Client[]> {
  constructor(private _clientService: ClientService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Client[]> {
    return this._clientService.getAllClients();
  }
}
