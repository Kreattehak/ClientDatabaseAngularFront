import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {Address} from './address';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {AuthenticationService} from '../login/authentication.service';

@Injectable()
export class AddressService {

  _getAllAddresses = '/api/admin/getAllAddresses?id=';
  _saveNewAddress = '/api/admin/saveNewAddress?id=';
  _updateAddress = '/api/admin/updateAddress';
  _deleteAddress = '/api/admin/deleteAddress';
  _setAsMainAddress = '/api/admin/editMainAddress';

  constructor(private _http: Http, private _authenticationService: AuthenticationService) {
  }

  getAllAddresses(id: number): Observable<Address[]> {
    return this._http.get(this._getAllAddresses + id, this.requestBearer())
      .map((response: Response) => this.parseAddresses(response))
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  saveNewAddress(newAddress: Address, clientId: number): Observable<number> {
    return this._http.post(this._saveNewAddress + clientId, newAddress, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(this.handleError);
  }

  updateAddress(activeAddress: Address): Observable<string> {
    return this._http.put(this._updateAddress, activeAddress, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(this.handleError);
  }

  deleteAddress(addressId: number, clientId: number): Observable<string> {
    return this._http.post(this._deleteAddress, JSON.stringify({
      'addressId' : addressId,
      'clientId': clientId
    }), this.requestBearer())
      .map((response: Response) => response.text())
      .catch(this.handleError);
  }

  setAsMainAddress(addressId: number, clientId: number): Observable<string> {
    return this._http.put(this._setAsMainAddress, JSON.stringify({
      addressId: addressId,
      clientId: clientId
    }), this.requestBearer())
      .map((response: Response) => response.text())
      .catch(this.handleError);
  }

  private handleError(error: Response): ErrorObservable {
    return Observable.throw(error.json().errorMessage || 'Server error');
  }

  private parseAddresses(response: Response): Address[] {
    const addresses: Address[] = response.json() as Address[];
    for (const address of addresses) {
      Object.assign(new Address, address);
      Object.setPrototypeOf(address, Address.prototype);
    }
    return addresses;
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
