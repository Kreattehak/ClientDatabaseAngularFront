import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastsManager} from 'ng2-toastr';
import {AddressService} from '../../app/addresses/address.service';
import {ValidationAndLocaleMessagesService} from '../../app/shared/validation-and-locale-messages.service';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthenticationService} from '../../app/login/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../testdata/stubs/route.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../testdata/stubs/validation-and-locale-messages.service.stub';
import {AddressServiceStub} from '../testdata/stubs/address.service.stub';
import {ToastsManagerStub} from '../testdata/stubs/toasts-manager.stub';
import {RouterStub} from '../testdata/stubs/router.stub';
import {Address} from '../../app/addresses/address';
import {TestData} from '../testdata/common/test-data';
import {TestUtils} from '../testdata/common/test-utils';
import {AddressFormComponent} from '../../app/addresses/address-form.component';

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
    validationServiceStub.resetData();
    addressServiceStub.resetData();
    toastsManagerStub.message = '';
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

  it('should validate input fields on blur', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    const streetNameInput = compiled.querySelector('#streetName');
    streetNameInput.dispatchEvent(new Event('blur'));

    // first call to ValidationService happens in ngOnInit()
    expect(validationServiceStub.timesCalled).toBe(2);
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
