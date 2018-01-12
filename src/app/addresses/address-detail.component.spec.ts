import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {AddressDetailComponent} from './address-detail.component';
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
import {Address} from './address';
import {RouterStub} from '../../test/router.stub';

const activatedRouteStub = new ActivatedRouteStub();
const routerStub = new RouterStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const addressServiceStub = new AddressServiceStub();
const toastsManagerStub = new ToastsManagerStub();

export const ADDRESS_DATA = {
  id: 1,
  streetName: 'street',
  cityName: 'city',
  zipCode: '44-444'
};
export const CLIENT_DATA = {
  id: 1,
  firstName: 'Fake',
  lastName: 'User',
  dateOfRegistration: '11-05-1974',
  mainAddress: ADDRESS_DATA
};

describe('AddressDetailComponent', () => {
  let component: AddressDetailComponent;
  let fixture: ComponentFixture<AddressDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
      ],
      declarations: [
        AddressDetailComponent,
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
    fixture = TestBed.createComponent(AddressDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    activatedRouteStub.resetData();
    toastsManagerStub.message = '';
    addressServiceStub.errorOccurred = false;
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
    activatedRouteStub.testData = {
      addresses: new Array<Address>(ADDRESS_DATA),
      client: CLIENT_DATA
    };
    fixture.detectChanges();

    expect(component.activeAddress).toBe(ADDRESS_DATA);
    expect(component.activeClient).toBe(CLIENT_DATA);
  });

  it('should create form for new address', () => {
    activatedRouteStub.testParamMap = {id: 1};
    activatedRouteStub.testData = {client: CLIENT_DATA};
    fixture.detectChanges();

    expect(component.activeAddress).toBeTruthy();
    expect(component.activeAddress.id).toBe(undefined);
    expect(component.activeClient).toBe(CLIENT_DATA);
  });

  it('should route to given client details', inject([Router], (router: Router) => {
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

  function setAddressFormWithDuplicatedData() {
    const data = {...ADDRESS_DATA}; // prevent test model object to change
    component.addressForm.setValue(data);

    return data;
  }

  function setActiveAddress() {
    component.activeAddress = ADDRESS_DATA;
  }

  function setAnotherActiveAddress() {
    component.activeAddress = {
      id: 1,
      streetName: 'Another Street',
      cityName: 'Another City',
      zipCode: '99-999'
    };
  }
});
