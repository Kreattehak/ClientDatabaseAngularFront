import {AuthenticationService} from '../../app/login/authentication.service';
import {LoginComponent} from '../../app/login/login.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AddressService} from '../../app/addresses/address.service';
import {ValidationAndLocaleMessagesService} from '../../app/shared/validation-and-locale-messages.service';
import {ToastsManager} from 'ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../testdata/stubs/route.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../testdata/stubs/validation-and-locale-messages.service.stub';
import {AddressServiceStub} from '../testdata/stubs/address.service.stub';
import {RouterStub} from '../testdata/stubs/router.stub';
import {ToastsManagerStub} from '../testdata/stubs/toasts-manager.stub';
import {HttpModule} from '@angular/http';
import {AuthenticationServiceStub} from '../testdata/stubs/authentication.service.stub';
import {BOOTBOX_TOKEN} from '../../app/utils/bootbox';
import {BootboxStub} from '../testdata/stubs/bootbox.stub';
import {TestData} from '../testdata/common/test-data';

const authenticationServiceStub = new AuthenticationServiceStub();
const activatedRouteStub = new ActivatedRouteStub();
const routerStub = new RouterStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const addressServiceStub = new AddressServiceStub();
const toastsManagerStub = new ToastsManagerStub();
const bootboxStub = new BootboxStub();

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        {provide: AuthenticationService, useValue: authenticationServiceStub},
        {provide: AddressService, useValue: addressServiceStub},
        {provide: ValidationAndLocaleMessagesService, useValue: validationServiceStub},
        {provide: ToastsManager, useValue: toastsManagerStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: Router, useValue: routerStub},
        {provide: BOOTBOX_TOKEN, useValue: bootboxStub},
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    activatedRouteStub.resetData();
    authenticationServiceStub.resetData();
    bootboxStub.resetData();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    fixture.detectChanges();

    expect(component.userForm instanceof FormGroup).toBeTruthy();
  });

  it('form should have proper fields', () => {
    fixture.detectChanges();
    expect(Object.keys(component.userForm.controls)).toEqual([
      'username', 'password'
    ]);
  });

  it('should call logout on AuthenticationService on init', () => {
    fixture.detectChanges();

    expect(authenticationServiceStub.logoutMethodCallsCounter).toBe(1);
  });

  it('should display logout message', () => {
    activatedRouteStub.testParamMap = {logout: true};
    fixture.detectChanges();

    expect(component.logoutMessage).toContain('fakeAnswer');
  });

  it('should display expired message', () => {
    activatedRouteStub.testParamMap = {expired: true};
    fixture.detectChanges();

    expect(component.errorMessage).toContain('fakeAnswer');
  });

  it('should subscribe to valueChanges and use ValidationService', () => {
    const spy = spyOn(validationServiceStub, 'onValueChanged');
    fixture.detectChanges();

    const objectToCompare = changeFieldValues();

    expect(spy).toHaveBeenCalledWith(component.userForm, component.formErrors, objectToCompare);
  });

  it('should use valueChanges and use ValidationService', () => {
    const spy = spyOn(validationServiceStub, 'onValueChanged');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(component.userForm, component.formErrors);
  });

  it('should display loginSuccessful message', () => {
    fixture.detectChanges();

    component.login();

    expect(toastsManagerStub.message).toContain('fakeAnswer');
  });

  it('should display error message', () => {
    fixture.detectChanges();
    authenticationServiceStub.errorOccurred = true;

    component.login();

    expect(bootboxStub.message).toContain('wrong');
  });

  it('should display error messages after login was unsuccessful', () => {
    const expectedMessage = 'loginUnsuccessful';
    component.errorMessage = expectedMessage;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#login-unsuccessful-message').textContent).toContain(expectedMessage);
  });

  it('should display message after user logout', () => {
    const expectedMessage = 'logout';
    component.logoutMessage = expectedMessage;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#logout-message').textContent).toContain(expectedMessage);
  });

  it('should disable submit button when input is invalid, e.g. after template init', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;

    expect(<HTMLButtonElement>(compiled.querySelector('.btn.btn-success')).outerHTML).toContain('disabled');
  });

  it('should display form error messages in paragraphs', () => {
    const errors = TestData.LOGIN_FORM_ERRORS;
    component.formErrors = errors;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    const errorMessageParagraphs = compiled.querySelectorAll('#form-error-messages p');
    expect(errorMessageParagraphs[0].textContent).toContain(errors.username);
    expect(errorMessageParagraphs[1].textContent).toContain(errors.password);
  });

  function changeFieldValues() {
    const object = {
      username: 'fakeUser',
      password: 'fakePassword'
    };
    let control = component.userForm.get('username');
    control.setValue(object.username);
    control = component.userForm.get('password');
    control.setValue(object.password);

    return object;
  }
});
