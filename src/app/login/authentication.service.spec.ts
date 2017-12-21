import {AuthenticationService} from './authentication.service';
import {BaseRequestOptions, Http, Response, ResponseOptions} from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import {inject, TestBed} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';

class MockError extends Response implements Error {
  name: any;
  message: any;
}

describe('AuthenticationService', () => {
  const fakeData = {
    username: 'fakeUser',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb21ldXNlciIsIm' +
    'F1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTUwODY4MjQ2NjI4OH0.l2TJQ-avQINPpgUd85RZKvmpJg59L' +
    'WELazzj2Z3aNPEBzyQyB3R3aCWwJLOYLJC5ZNhsWW3J9os8U3Qo6w_F4A'
  };

  beforeEach(() => {
    TestBed.configureTestingModule(({
      providers: [
        AuthenticationService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ]
    }));
  });

  it('should map login response to truthy boolean', inject([AuthenticationService, MockBackend], (authService, mockBackend) => {
    const response = new ResponseOptions({
      body: JSON.stringify(fakeData)
    });
    const baseResponse = new Response(response);
    mockBackend.connections.subscribe(
      (c: MockConnection) => c.mockRespond(baseResponse)
    );

    authService.login(fakeData.username, 'password').subscribe(data => {
      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(fakeData));
      expect(data).toBeTruthy();
    });
  }));

  it('should map login response to falsy boolean', inject([AuthenticationService, MockBackend], (authService, mockBackend) => {
    const bodyMessage = 'Unauthorized';
    const response = new ResponseOptions({
      status: 401,
      body: bodyMessage
    });
    const baseError = new MockError(response);
    mockBackend.connections.subscribe(
      (c: MockConnection) => c.mockError(baseError)
    );

    authService.login().subscribe(data => {
      // do nothing
    }, error => {
      expect(error).toContain(bodyMessage);
    });
  }));
});
