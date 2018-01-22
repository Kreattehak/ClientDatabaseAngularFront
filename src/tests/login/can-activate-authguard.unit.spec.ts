import {AuthenticationService} from '../../app/login/authentication.service';
import {CanActivateAuthGuard} from '../../app/login/can-activate-authguard';
import {Router} from '@angular/router';
import {RouterStub} from '../testdata/stubs/router.stub';
import {inject, TestBed} from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {ValidationAndLocaleMessagesService} from '../../app/shared/validation-and-locale-messages.service';

describe('CanActivateAuthGuardUnitTests', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        {provide: Router, useClass: RouterStub},
        AuthenticationService,
        ValidationAndLocaleMessagesService,
        CanActivateAuthGuard
      ]
    });
  });

  it('should activate route when user is logged in and token is not expired',
    inject([AuthenticationService, CanActivateAuthGuard],
      (authService: AuthenticationService, guard: CanActivateAuthGuard) => {
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(authService, 'isTokenExpired').and.returnValue(false);

        const result = guard.canActivate(null, null);

        expect(result).toBeTruthy();
      }));

  it('should block route when user is not logged in',
    inject([AuthenticationService, CanActivateAuthGuard, Router],
      (authService: AuthenticationService, guard: CanActivateAuthGuard, router: Router) => {
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        const spy = spyOn(router, 'navigate');

        const result = guard.canActivate(null, null);

        expect(result).toBeFalsy();
        expect(spy).toHaveBeenCalledWith(['/login']);
      }));

  it('should block route when token has expired',
    inject([AuthenticationService, CanActivateAuthGuard, Router],
      (authService: AuthenticationService, guard: CanActivateAuthGuard, router: Router) => {
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(authService, 'isTokenExpired').and.returnValue(true);
        const spy = spyOn(router, 'navigate');

        const result = guard.canActivate(null, null);

        expect(result).toBeFalsy();
        expect(spy).toHaveBeenCalledWith(['/login', {expired: 'true'}]);
      }));
});
