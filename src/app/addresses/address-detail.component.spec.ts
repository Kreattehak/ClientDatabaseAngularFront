import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {AddressDetailComponent} from './address-detail.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastsManager} from 'ng2-toastr';
import {AddressService} from './address.service';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthenticationService} from '../login/authentication.service';
import {Router} from '@angular/router';
import {ActivatedRouteStub} from '../../test/router.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../../test/validation-and-locale-messages.service.stub';
import {AddressServiceStub} from '../../test/address.service.stub';
import {ToastsManagerStub} from '../../test/toasts-manager.stub';

const activatedRoute = new ActivatedRouteStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const addressServiceStub = new AddressServiceStub();
const toastsManagerStub = new ToastsManagerStub();

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
        {provide: AddressService, useValue: addressServiceStub},
        {provide: ValidationAndLocaleMessagesService, useValue: validationServiceStub},
        {provide: ToastsManager, useValue: toastsManagerStub},
        AuthenticationService,
        // {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 1}}, paramMap: Observable.of({get: () => 1})}}
      ]
    });
    fixture = TestBed.createComponent(AddressDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the ap1p', () => {
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
    setAddressForm();

    component.onSubmit(1);

    expect(component.submitted).toBeFalsy();
  });

  it('should try to add new address', () => {
    fixture.detectChanges();
    component.isNewAddress = true;
    const activeAddress = setActiveAddress();

    setAddressForm();
    const spy = spyOn(addressServiceStub, 'saveNewAddress').and.callThrough();

    component.onSubmit(0); // it's not clientId

    expect(spy).toHaveBeenCalledWith(activeAddress, 0);
  });

  function setAddressForm() {
    component.addressForm.setValue({
      id: 1,
      streetName: 'street',
      cityName: 'city',
      zipCode: '44-444'
    });
  }

  function setActiveAddress() {
    return component.activeAddress = {
      id: 1,
      streetName: 'street',
      cityName: 'city',
      zipCode: '44-444'
    };
  }
});
