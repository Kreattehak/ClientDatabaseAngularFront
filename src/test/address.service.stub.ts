import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Address} from '../app/addresses/address';
import {TestData} from './test-data';

@Injectable()
export class AddressServiceStub {
  public errorOccurred = false;
  public errorResponseOccurred = false;
  public returnedAddress: Address;

  saveNewAddress(newAddress: Address, clientId: number): Observable<number> {
    if (this.errorResponseOccurred) {
      return Observable.throw('Something went wrong!');
    }
    if (this.errorOccurred) {
      return Observable.throw(-1);
    } else {
      return Observable.of(1);
    }
  }

  updateAddress(updatedAddress: Address): Observable<string> {
    if (this.errorOccurred) {
      return Observable.throw('Something went wrong!');
    } else {
      return Observable.of('Everything went fine!');
    }
  }

  getAllAddresses(id: number): Observable<Address[]> {
    const address = TestData.ADDRESS_DATA;
    this.returnedAddress = address;
    return Observable.of([address]);
  }

  setAsMainAddress(addressId: number, clientId: number): Observable<string> {
    if (this.errorOccurred) {
      return Observable.throw('Something went wrong!');
    } else {
      return Observable.of('Everything went fine!');
    }
  }

  deleteAddress(addressId: number, clientId: number): Observable<string> {
    if (this.errorOccurred) {
      return Observable.throw('Something went wrong!');
    } else {
      return Observable.of('Everything went fine!');
    }
  }

  resetData(): void {
    this.errorOccurred = false;
    this.errorResponseOccurred = false;
    this.returnedAddress = null;
  }
}
