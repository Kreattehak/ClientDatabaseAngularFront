import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Client} from '../../app/clients/client';
import {TestData} from '../common/test-data';

@Injectable()
export class ClientServiceStub {
  public errorOccurred = false;
  public errorResponseOccurred = false;
  public returnedClient: Client;

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

  deleteClient(clientToBeDeleted: Client): Observable<string> {
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
      this.returnedClient = TestData.CLIENT_DATA;
      return Observable.of([this.returnedClient]);
    }
  }

  resetData(): void {
    this.errorOccurred = false;
    this.errorResponseOccurred = false;
    this.returnedClient = null;
  }
}
