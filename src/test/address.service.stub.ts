import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Address} from '../app/addresses/address';

@Injectable()
export class AddressServiceStub {
  saveNewAddress(newAddress: Address, clientId: number): Observable<number> {
    return Observable.of(1);
  }

  updateAddress(updatedAddress: Address): Observable<string> {
    return Observable.of('Everything went fine!');
  }
}
