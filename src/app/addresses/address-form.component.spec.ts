import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastsManager} from 'ng2-toastr';
import {AddressService} from './address.service';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthenticationService} from '../login/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../../test/route.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../../test/validation-and-locale-messages.service.stub';
import {AddressServiceStub} from '../../test/address.service.stub';
import {ToastsManagerStub} from '../../test/toasts-manager.stub';
import {RouterStub} from '../../test/router.stub';
import {Address} from './address';
import {TestData} from '../../test/test-data';
import {TestUtils} from '../../test/test-utils';
import {AddressFormComponent} from './address-form.component';

const activatedRouteStub = new ActivatedRouteStub();
const routerStub = new RouterStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const addressServiceStub = new AddressServiceStub();
const toastsManagerStub = new ToastsManagerStub();

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
      ],
      declarations: [
        AddressFormComponent,
      ],
      providers: [
        AuthenticationService,
        {provide: AddressService, useValue: addressServiceStub},
        {provide: ValidationAndLocaleMessagesService, useValue: validationServiceStub},
        {provide: ToastsManager, useValue: toastsManagerStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: Router, useValue: routerStub}
      ]
    });
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    activatedRouteStub.resetData();
    toastsManagerStub.message = '';
    addressServiceStub.resetData();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    fixture.detectChanges();

    expect(component.addressForm instanceof FormGroup).toBeTruthy();
  });

  it('form should have proper fields', () => {
    fixture.detectChanges();
    expect(Object.keys(component.addressForm.controls)).toEqual([
      'id', 'streetName', 'cityName', 'zipCode'
    ]);
  });

  it('should subscribe to valueChanges and use ValidationService', () => {
    const spy = spyOn(validationServiceStub, 'onValueChanged');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(component.addressForm, component.formErrors);
  });

  it('should populate form with fetched data', () => {
    activatedRouteStub.testParamMap = {id: 1, addressId: 1};
    const address = TestData.ADDRESS_DATA;
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      addresses: [address],
      client: client
    };
    fixture.detectChanges();

    expect(component.activeAddress).toBe(address);
    expect(component.activeClient).toBe(client);
  });

  it('should create form for new address', () => {
    activatedRouteStub.testParamMap = {id: 1};
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {client: client};
    fixture.detectChanges();

    expect(component.activeAddress).toBeTruthy();
    expect(component.activeAddress.id).toBe(undefined);
    expect(component.activeClient).toBe(client);
  });

  it('should route back to ClientDetailComponent', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');

    component.onBack();

    expect(spy).toHaveBeenCalledWith(['/clients', undefined, 'details']);
  }));

  it('should set submitted to true', () => {
    fixture.detectChanges();

    component.onSubmit(1);

    expect(component.submitted).toBeTruthy();
  });

  it('should check for data duplication', () => {
    fixture.detectChanges();
    component.isNewAddress = false;

    setActiveAddress();
    setAddressFormWithDuplicatedData();

    component.onSubmit(1);

    expect(component.submitted).toBeFalsy();
  });

  it('should try to add new address', () => {
    fixture.detectChanges();
    component.isNewAddress = true;
    setActiveAddress();

    const activeAddress = setAddressFormWithDuplicatedData();
    const spy = spyOn(addressServiceStub, 'saveNewAddress').and.callThrough();

    component.onSubmit(1); // it's not clientId

    expect(spy).toHaveBeenCalledWith(activeAddress, Number(null));
  });

  it('should show error when trying to add new address', () => {
    fixture.detectChanges();
    component.isNewAddress = true;
    setActiveAddress();
    addressServiceStub.errorOccurred = true;

    component.onSubmit(1);

    expect(toastsManagerStub.message).toContain('fakeAnswer');
  });

  it('should show error response when trying to add new address', () => {
    fixture.detectChanges();
    component.isNewAddress = true;
    setActiveAddress();
    addressServiceStub.errorResponseOccurred = true;

    component.onSubmit(1);

    expect(toastsManagerStub.message).toContain('wrong');
  });

  it('should update existing address', () => {
    fixture.detectChanges();
    component.isNewAddress = false;
    setAnotherActiveAddress();

    const activeAddress = setAddressFormWithDuplicatedData();
    const spy = spyOn(addressServiceStub, 'updateAddress').and.callThrough();

    component.onSubmit(999);

    activeAddress.id = 999;
    expect(spy).toHaveBeenCalledWith(activeAddress);
  });

  it('should show error when trying to update existing address', () => {
    fixture.detectChanges();
    component.isNewAddress = false;
    setAnotherActiveAddress();
    addressServiceStub.errorOccurred = true;

    component.onSubmit(1);

    expect(toastsManagerStub.message).toContain('wrong');
  });

  it('should display legend for new address', () => {
    activatedRouteStub.testParamMap = {id: 1};
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      client: client
    };
    fixture.detectChanges();

    const legendText = fixture.debugElement.nativeElement.querySelector('legend').textContent;
    expect(legendText).toContain(client.firstName);
    expect(legendText).toContain(client.lastName);
  });

  it('should display legend for editing address', () => {
    activatedRouteStub.testParamMap = {id: 1, addressId: 1};
    const address = TestData.ADDRESS_DATA;
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      addresses: [address],
      client: client
    };
    fixture.detectChanges();

    const legendText = fixture.debugElement.nativeElement.querySelector('legend').textContent;
    expect(legendText).toContain(address.streetName);
    expect(legendText).toContain(address.cityName);
    expect(legendText).toContain(address.zipCode);
  });

  it('should display form error messages in paragraphs', () => {
    const errors = TestData.ADDRESS_FORM_ERRORS;
    component.formErrors = errors;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    const errorMessageParagraphs = compiled.querySelectorAll('#form-error-messages p');
    expect(errorMessageParagraphs[0].textContent).toContain(errors.streetName);
    expect(errorMessageParagraphs[1].textContent).toContain(errors.cityName);
    expect(errorMessageParagraphs[2].textContent).toContain(errors.zipCode);
  });

  it('should disable submit button when input is invalid, e.g. after template init', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('input[type="submit"]').outerHTML).toContain('disabled');
  });

  it('should disable submit button after submit', () => {
    activatedRouteStub.testParamMap = {id: 1, addressId: 1};
    const address = TestData.ADDRESS_DATA;
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      addresses: [address],
      client: client
    };
    component.submitted = true;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('input[type="submit"]').outerHTML).toContain('disabled');
  });

  function setActiveAddress() {
    component.activeAddress = TestData.ADDRESS_DATA;
  }

  function setAnotherActiveAddress() {
    component.activeAddress = {
      id: 1,
      streetName: 'Another Street',
      cityName: 'Another City',
      zipCode: '99-999'
    };
  }

  function setAddressFormWithDuplicatedData() {
    return <Address>TestUtils.setFormWithDuplicatedData(TestData.ADDRESS_DATA, component.addressForm);
  }
});
