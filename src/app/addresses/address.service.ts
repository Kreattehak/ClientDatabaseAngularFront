import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Address} from './address';
import {AuthenticationService} from '../login/authentication.service';
import {ErrorHandler} from '../shared/error-handler';
import {Observable} from 'rxjs/Observable';

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
      .map((response: Response) => response.json() as Address[])
      .catch(ErrorHandler.handleError);
  }

  saveNewAddress(newAddress: Address, clientId: number): Observable<number> {
    return this._http.post(this._saveNewAddress + clientId, newAddress, this.requestBearer())
      .map((response: Response) => Number(response.text()))
      .catch(ErrorHandler.handleError);
  }

  updateAddress(activeAddress: Address): Observable<string> {
    return this._http.put(this._updateAddress, activeAddress, this.requestBearer())
      .map((response: Response) => response.text())
      .catch(ErrorHandler.handleError);
  }

  deleteAddress(addressId: number, clientId: number): Observable<string> {
    return this._http.post(this._deleteAddress, JSON.stringify({
      'addressId': addressId,
      'clientId': clientId
    }), this.requestBearer())
      .map((response: Response) => response.text())
      .catch(ErrorHandler.handleError);
  }

  setAsMainAddress(addressId: number, clientId: number): Observable<string> {
    return this._http.put(this._setAsMainAddress, JSON.stringify({
      addressId: addressId,
      clientId: clientId
    }), this.requestBearer())
      .map((response: Response) => response.text())
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
