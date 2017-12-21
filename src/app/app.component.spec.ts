import {ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthenticationService} from './login/authentication.service';
import {HttpModule} from '@angular/http';
import {ToastModule} from 'ng2-toastr';
import {Router, RouterLinkWithHref, RouterOutlet} from '@angular/router';
import {AboutAuthorComponent} from './utils/about-author.component';
import {By} from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [{path: 'aboutAuthor', component: AboutAuthorComponent, outlet: 'messages'}]),
        HttpModule,
        ToastModule.forRoot(),
      ],
      declarations: [
        AppComponent,
        AboutAuthorComponent
      ],
      providers: [
        AuthenticationService,
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

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

    expect(spy).toHaveBeenCalledWith([{outlets: {messages: ['aboutAuthor']}}]);
    expect(component.isAboutAuthorDisplayed).toBeTruthy();
  }));

  it('should hide AboutAuthorComponent on second route', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');
    component.isAboutAuthorDisplayed = true;
    fixture.detectChanges();

    component.showAboutAuthor();

    expect(spy).toHaveBeenCalledWith([{outlets: {messages: null}}]);
    expect(component.isAboutAuthorDisplayed).toBeFalsy();
  }));

  it('should have a router outlet', () => {
    const d = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(d).not.toBeNull();
  });

  it('should have a second router outlet', () => {
    const d = fixture.debugElement.query(By.css('[name="messages"]'));

    expect(d).not.toBeNull();
  });

  it('should have links to new client and to logout', () => {
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

    const newClientLink = links.findIndex(de => de.properties['href'] === '/clients/new');
    const logoutLink = links.findIndex(de => de.properties['href'] === '/login;logout=true');

    expect(newClientLink).toBeGreaterThan(-1);
    expect(logoutLink).toBeGreaterThan(-1);
  });
});
