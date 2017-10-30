import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {JwtHelper} from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthenticationService {

  _postSetUp: RequestOptions = new RequestOptions({
    headers: new Headers({
      'Content-Type': 'application/json',
    })
  });

  _authUrl = '/api/auth';

  private _jwtHelper: JwtHelper;

  constructor(private _http: Http) {
    this._jwtHelper = new JwtHelper();
  }

  isLoggedIn(): boolean {
    const token: String = this.getToken();
    return token && token.length > 0;
  }

  isTokenExpired(): boolean {
    const token: string = this.getToken();
    return this._jwtHelper.isTokenExpired(token);
  }

  login(username: string, password: string): Observable<boolean> {
    return this._http.post(this._authUrl, JSON.stringify({
      username: username,
      password: password
    }), this._postSetUp)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const token = response.json() && response.json().token;
        if (token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));

          // return true to indicate successful login
          return true;
        } else {
          Observable.throw(response.text());
        }
      }).catch((error: Response) => Observable.throw(error.text()));
  }

  getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    return token ? token : '';
  }

  getUserName(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = currentUser && currentUser.username;
    return username ? username : '';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}
