import {AuthenticationService} from './authentication.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {TestUtils} from '../../test/test-utils';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {ValidationAndLocaleMessagesServiceStub} from '../../test/validation-and-locale-messages.service.stub';

const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();

describe('AuthenticationServiceIntegrationTests', () => {
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
        {provide: ValidationAndLocaleMessagesService, useValue: validationServiceStub}
      ]
    }));
  });

  it('should map login response to truthy boolean', inject([AuthenticationService, MockBackend],
    (authService: AuthenticationService, mockBackend: MockBackend) => {
      TestUtils.createResponse(mockBackend, fakeData);

      authService.login(fakeData.username, 'password').subscribe(data => {
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(fakeData));
        expect(data).toBeTruthy();
      });
    }));

  it('should catch error when trying to authenticate', inject([AuthenticationService, MockBackend],
    (authService: AuthenticationService, mockBackend: MockBackend) => {
      const bodyMessage = 'Unauthorized';
      TestUtils.createError(mockBackend, bodyMessage);

      authService.login(fakeData.username, 'wrongPassword').subscribe(
        null,
        error => {
          expect(error).toContain(bodyMessage);
        });
    }));

  it('should catch gateway timeout and do not show api auth endpoint', inject([AuthenticationService, MockBackend],
    (authService: AuthenticationService, mockBackend: MockBackend) => {
      TestUtils.createError(mockBackend, '', 504);

      authService.login(fakeData.username, 'wrongPassword').subscribe(
        null,
        error => {
          expect(error).toContain('fakeAnswer');
        });
    }));

  it('should throw error, when token is not present', inject([AuthenticationService, MockBackend],
    (authService: AuthenticationService, mockBackend: MockBackend) => {
      const bodyMessage = 'Something went wrong';
      TestUtils.createResponse(mockBackend, bodyMessage);

      authService.login(fakeData.username, 'wrongPassword').subscribe(
        (data: string) => expect(data).toContain(bodyMessage));
    }));
});
