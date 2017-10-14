import {Injectable, OnInit} from '@angular/core';
import {Http, RequestOptions, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {Client} from './client';
import {Address} from '../addresses/address';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {AuthenticationService} from '../login/authentication.service';

@Injectable()
export class ClientService {

  _getAllClients = '/api/getAllClients';
  _updateClient = '/api/admin/updateClient';
  _deleteClient = '/api/admin/deleteClient';
  _getClient = '/api/admin/getClient?id=';
  _saveNewClient = '/api/admin/saveNewClient';

  constructor(private _http: Http, private _authenticationService: AuthenticationService) {
  }

  getAllClients(): Observable<Client[]> {
    return this._http.get(this._getAllClients)
      .map((response: Response) => this.parseClients(response))
      .catch(this.handleError);
  }

  deleteClient(activeClient: Client): Observable<string> {
    return this._http.post(this._deleteClient, activeClient, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(this.handleError);
  }

  updateClient(activeClient: Client): Observable<string> {
    return this._http.put(this._updateClient, activeClient, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(this.handleError);
  }

  getClient(clientId: number): Observable<Client> {
    return this._http.get(this._getClient + clientId, this.requestBearer())
      .map((response: Response) => response.json() as Client)
      .catch(this.handleError);
  }

  saveNewClient(newClient: Client): Observable<number> {
    return this._http.post(this._saveNewClient, newClient, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(this.handleError);
  }

  private handleError(error: Response): ErrorObservable {
    return Observable.throw(error.json().errorMessage || 'Server error');
  }

  private parseClients(response: Response): Client[] {
    const clients: Client[] = response.json() as Client[];
    for (const client of clients) {
      Object.assign(new Client, client);
      Object.setPrototypeOf(client, Client.prototype);
      if (client.mainAddress) {
        Object.assign(new Address, client.mainAddress);
        Object.setPrototypeOf(client.mainAddress, Address.prototype);
      }
    }
    return clients;
  }

  private requestBearer(): RequestOptions {
    return new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this._authenticationService.getToken(),
        'Logged-User' : this._authenticationService.getUserName()
      })
    });
  }
}
