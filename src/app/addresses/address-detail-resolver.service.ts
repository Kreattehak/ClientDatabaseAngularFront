import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Address} from './address';
import {AddressService} from './address.service';

@Injectable()
export class AddressDetailResolver implements Resolve<Address[]> {

  constructor(private _addressService: AddressService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Address[]> {
    return this._addressService.getAllAddresses(+route.paramMap.get('id'));
  }
}
