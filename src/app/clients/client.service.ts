import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Client} from './client';
import {AuthenticationService} from '../login/authentication.service';
import {ErrorHandler} from '../shared/error-handler';
import {Observable} from 'rxjs/Observable';

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
      .map((response: Response) => response.json() as Client[])
      .catch(ErrorHandler.handleError);
  }

  deleteClient(activeClient: Client): Observable<string> {
    return this._http.post(this._deleteClient, activeClient, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(ErrorHandler.handleError);
  }

  updateClient(activeClient: Client): Observable<string> {
    return this._http.put(this._updateClient, activeClient, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(ErrorHandler.handleError);
  }

  getClient(clientId: number): Observable<Client> {
    return this._http.get(this._getClient + clientId, this.requestBearer())
      .map((response: Response) => response.json() as Client)
      .catch(ErrorHandler.handleError);
  }

  saveNewClient(newClient: Client): Observable<number> {
    return this._http.post(this._saveNewClient, newClient, this.requestBearer())
      .map((response: Response) => Number(response.text()))
      .catch(ErrorHandler.handleError);
  }

  private requestBearer(): RequestOptions {
    return new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this._authenticationService.getToken(),
        'Logged-User': this._authenticationService.getUserName()
      })
    });
  }
}
