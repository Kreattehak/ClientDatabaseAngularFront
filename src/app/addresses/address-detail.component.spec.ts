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

const activatedRouteStub = new ActivatedRouteStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const addressServiceStub = new AddressServiceStub();
const toastsManagerStub = new ToastsManagerStub();

const addressData = {
  id: 1,
  streetName: 'street',
  cityName: 'city',
  zipCode: '44-444'
};
const clientData = {
  id: 1,
  firstName: 'Fake',
  lastName: 'User',
  dateOfRegistration: '11-05-1974',
  mainAddress: addressData
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
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    });
    fixture = TestBed.createComponent(AddressDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    activatedRouteStub.resetData();
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

  it('should populate form with fetched data', () => {
    activatedRouteStub.testParamMap = {id: 1, addressId: 1};
    activatedRouteStub.testData = {
      addresses: new Array<Address>(addressData),
      client: clientData
    };
    fixture.detectChanges();

    expect(component.activeAddress).toBe(addressData);
    expect(component.activeClient).toBe(clientData);
  });

  it('should create form for new address', () => {
    activatedRouteStub.testParamMap = {id: 1};
    activatedRouteStub.testData = {client: clientData};
    fixture.detectChanges();

    expect(component.activeAddress).toBeTruthy();
    expect(component.activeAddress.id).toBe(undefined);
    expect(component.activeClient).toBe(clientData);
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

  it('should try to update existing address', () => {
    fixture.detectChanges();
    component.isNewAddress = false;
    setAnotherActiveAddress();

    const activeAddress = setAddressFormWithDuplicatedData();
    const spy = spyOn(addressServiceStub, 'updateAddress').and.callThrough();

    component.onSubmit(1); // it's not clientId

    expect(spy).toHaveBeenCalledWith(activeAddress);
  });

  it('should try to update existing address', () => {
    fixture.detectChanges();
    component.isNewAddress = false;
    setAnotherActiveAddress();

    const activeAddress = setAddressFormWithDuplicatedData();
    const spy = spyOn(addressServiceStub, 'updateAddress').and.callThrough();

    component.onSubmit(999); // it's not clientId

    activeAddress.id = 999;
    expect(spy).toHaveBeenCalledWith(activeAddress);
  });

  it('should try to update existing address', () => {
    activatedRouteStub.testParamMap = {'clientId': '1'};
    fixture.detectChanges();
    console.log(component.activeClient);
  });

  function setAddressFormWithDuplicatedData() {
    const data = addressData;
    component.addressForm.setValue(data);

    return data;
  }

  function setActiveAddress() {
    component.activeAddress = addressData;
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
