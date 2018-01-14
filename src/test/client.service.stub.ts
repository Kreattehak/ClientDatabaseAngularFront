import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Client} from '../app/clients/client';
import {CLIENT_DATA} from './test-utils';

@Injectable()
export class ClientServiceStub {
  public errorOccurred: boolean;
  public errorResponseOccurred: boolean;

  getClient(clientId: number): Observable<Client> {
    const client = new Client();
    client.id = clientId;
    return Observable.of(client);
  }

  saveNewClient(newClient: Client): Observable<number> {
    if (this.errorResponseOccurred) {
      return Observable.throw('Something went wrong!');
    }
    if (this.errorOccurred) {
      return Observable.throw(-1);
    } else {
      return Observable.of(1);
    }
  }

  updateClient(updatedClient: Client): Observable<string> {
    if (this.errorOccurred) {
      return Observable.throw('Something went wrong!');
    } else {
      return Observable.of('Everything went fine!');
    }
  }

  getAllClients(): Observable<Client[]> {
    if (this.errorResponseOccurred) {
      return Observable.throw('Something went wrong!');
    }
    if (this.errorOccurred) {
      return Observable.of([]);
    } else {
      return Observable.of([CLIENT_DATA]);
    }
  }

  resetData(): void {
    this.errorOccurred = false;
    this.errorResponseOccurred = false;
  }
}
