import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthenticationService} from './login/authentication.service';
import {HttpModule} from '@angular/http';
import {ToastModule} from 'ng2-toastr';
import {APP_BASE_HREF} from '@angular/common';
import {Router} from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        ToastModule.forRoot(),
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AuthenticationService,
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should not display info about author after component init', () => {
    expect(component.isAboutAuthorDisplayed).toBeUndefined();
  });

  it('should display info about author', () => {
    component.showAboutAuthor();

    expect(component.isAboutAuthorDisplayed).toBeTruthy();
  });

  it('should hide info about author on second click', () => {
    component.isAboutAuthorDisplayed = true;

    component.showAboutAuthor();

    expect(component.isAboutAuthorDisplayed).toBeFalsy();
  });

  it('should initialize user name field', () => {
    const service = TestBed.get(AuthenticationService);
    spyOn(service, 'getUserName').and.returnValue('user');
    fixture.detectChanges();

    expect(component.userName).toBe('user');
  });

  it('should display AboutAuthorComponent on second route', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');

    component.showAboutAuthor();

    const url = spy.calls.first().args[0];

    expect(JSON.stringify(url)).toContain('aboutAuthor');
    expect(component.isAboutAuthorDisplayed).toBeTruthy();
  }));

  it('should hide AboutAuthorComponent on second route', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');
    component.isAboutAuthorDisplayed = true;
    fixture.detectChanges();

    component.showAboutAuthor();

    const url = spy.calls.first().args[0];

    expect(JSON.stringify(url)).toContain('null');
    expect(component.isAboutAuthorDisplayed).toBeFalsy();

  }));

  it('fakeAsync works', fakeAsync(() => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => done = true);
    tick(20);
    expect(done).toBeTruthy();
  }));

});
