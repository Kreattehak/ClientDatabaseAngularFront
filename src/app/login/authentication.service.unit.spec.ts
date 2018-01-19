import {AuthenticationService} from './authentication.service';
import {Http} from '@angular/http';

describe('AuthenticationServiceUnitTests', () => {
  // token below doesn't have expiration date
  const fakeData = {
    username: 'fakeUser',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb21ldXNlciIsIm' +
    'F1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTUwODY4MjQ2NjI4OH0.l2TJQ-avQINPpgUd85RZKvmpJg59L' +
    'WELazzj2Z3aNPEBzyQyB3R3aCWwJLOYLJC5ZNhsWW3J9os8U3Qo6w_F4A'
  };
  const fakeStorage = JSON.stringify(fakeData);
  let service: AuthenticationService;
  let fakeHttp: Http;

  beforeEach(() => {
    fakeHttp = new Http(null, null);
    service = new AuthenticationService(fakeHttp);
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return fakeStorage;
    });
  });

  it('should create the AuthenticationService', () => {
    expect(service).toBeTruthy();
  });

  it('should return JWT Token', () => {
    const token = service.getToken();

    expect(token).toBe(fakeData.token);
  });

  it('should return user name', () => {
    const userName = service.getUserName();

    expect(userName).toBe(fakeData.username);
  });

  it('should logout', () => {
    const spy = spyOn(localStorage, 'removeItem');

    service.logout();

    expect(spy).toHaveBeenCalled();
  });

  it('should check if user is logged in', () => {
    const isLoggedIn = service.isLoggedIn();

    expect(isLoggedIn).toBeTruthy();
  });

  it('should check if token is expired', () => {
    const isLoggedIn = service.isTokenExpired();

    expect(isLoggedIn).toBeFalsy();
  });
});
