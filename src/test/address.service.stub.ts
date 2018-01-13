import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Address} from '../app/addresses/address';

@Injectable()
export class AddressServiceStub {
  public errorOccurred: boolean;
  public errorResponseOccurred: boolean;

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

  // Used in AddressDetailResolverTests
  getAllAddresses(id: number): Observable<Address[]> {
    const address = new Address();
    address.id = id;
    return Observable.of([address, new Address()]);
  }

  resetData(): void {
    this.errorOccurred = false;
    this.errorResponseOccurred = false;
  }
}
