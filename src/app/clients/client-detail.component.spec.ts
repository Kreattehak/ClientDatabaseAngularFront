import {ClientDetailComponent} from './client-detail.component';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {AddressService} from '../addresses/address.service';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {ToastsManager} from 'ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AddressServiceStub} from '../../test/address.service.stub';
import {ToastsManagerStub} from '../../test/toasts-manager.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../../test/validation-and-locale-messages.service.stub';
import {RouterStub} from '../../test/router.stub';
import {BootboxStub} from '../../test/bootbox.stub';
import {BOOTBOX_TOKEN} from '../utils/bootbox';
import {ActivatedRouteStub} from '../../test/route.stub';
import {TestData} from '../../test/test-data';

const addressServiceStub = new AddressServiceStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const toastsManagerStub = new ToastsManagerStub();
const activatedRouteStub = new ActivatedRouteStub();
const routerStub = new RouterStub();
const bootboxStub = new BootboxStub();

describe('ClientDetailComponentTests', () => {
  let component: ClientDetailComponent;
  let fixture: ComponentFixture<ClientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        ClientDetailComponent
      ],
      providers: [
        {provide: AddressService, useValue: addressServiceStub},
        {provide: ValidationAndLocaleMessagesService, useValue: validationServiceStub},
        {provide: ToastsManager, useValue: toastsManagerStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: Router, useValue: routerStub},
        {provide: BOOTBOX_TOKEN, useValue: bootboxStub},
      ]
    });
    fixture = TestBed.createComponent(ClientDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    toastsManagerStub.message = '';
    addressServiceStub.resetData();
    activatedRouteStub.resetData();
    bootboxStub.resetData();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with fetched data', () => {
    activatedRouteStub.testData = {
      client: TestData.CLIENT_DATA,
      addresses: [TestData.ADDRESS_DATA]
    };
    fixture.detectChanges();

    expect(component.client.id).toBe(1);
    expect(component.addresses[0].id).toBe(1);
  });

  it('should set active address after selecting a row', () => {
    const address = TestData.ADDRESS_DATA;

    component.markAsActive(address);

    expect(component.activeAddress).toBe(address);
  });

  it('should delete active mark from table row', () => {
    const address = TestData.ADDRESS_DATA;
    component.activeAddress = address;

    component.markAsActive(address);

    expect(component.activeAddress).toBe(null);
  });

  it('should navigate to AddressDetailComponent after clicking add address button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.client = TestData.CLIENT_DATA;

      component.onAddAddress();

      expect(spy).toHaveBeenCalledWith(['/clients', component.client.id, 'newAddress']);
    }));

  it('should navigate to AddressDetailComponent after clicking edit address button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.client = TestData.CLIENT_DATA;
      component.activeAddress = TestData.ADDRESS_DATA;

      component.onEditAddress();

      expect(spy).toHaveBeenCalledWith(['/clients',
        component.client.id, 'address', component.activeAddress.id]);
    }));

  it('should block navigation to AddressDetailComponent when table row is not selected', () => {
    component.onEditAddress();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should not set main address when active address is not set', () => {
    component.onSetAsMainAddress();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should not set main address when address already is main address', () => {
    component.client = TestData.CLIENT_DATA;
    component.activeAddress = TestData.ADDRESS_DATA;

    component.onSetAsMainAddress();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should perform set main address action', () => {
    component.client = TestData.CLIENT_DATA;
    component.activeAddress = TestData.ADDRESS_DATA;
    component.activeAddress.id = 2;

    component.onSetAsMainAddress();

    expect(component.activeAddress).toBe(null);
    expect(toastsManagerStub.message).toContain('fine');
  });

  it('should show error when trying to change main address', () => {
    component.client = TestData.CLIENT_DATA;
    component.activeAddress = TestData.ADDRESS_DATA;
    component.activeAddress.id = 2;
    addressServiceStub.errorOccurred = true;

    component.onSetAsMainAddress();

    expect(toastsManagerStub.message).toContain('wrong');
  });

  it('should navigate to ClientListComponent after clicking back button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');

      component.onBack();

      expect(spy).toHaveBeenCalledWith(['/clients']);
    }));

  it('should not delete when active address is not set', () => {
    component.onRemoveAddress();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should not delete address when it`s a main address', () => {
    component.client = TestData.CLIENT_DATA;
    component.activeAddress = TestData.ADDRESS_DATA;

    component.onRemoveAddress();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should use bootbox for user confirmation', () => {
    component.client = TestData.CLIENT_DATA;
    component.activeAddress = TestData.ADDRESS_DATA;
    component.activeAddress.id = 2;

    component.onRemoveAddress();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should perform delete action', () => {
    const addressToBeDeleted = TestData.ADDRESS_DATA;
    component.addresses = [addressToBeDeleted];
    component.activeAddress = addressToBeDeleted;

    component.client = TestData.CLIENT_DATA;
    component.client.mainAddress.id = 2;
    bootboxStub.isConfirmedAction = true;

    component.onRemoveAddress();

    expect(component.addresses.length).toBe(0);
    expect(component.activeAddress).toBe(null);
    expect(toastsManagerStub.message).toContain('fine');
  });

  it('should perform delete address action, server side error response', () => {
    const addressToBeDeleted = TestData.ADDRESS_DATA;
    component.addresses = [addressToBeDeleted];
    component.activeAddress = addressToBeDeleted;

    component.client = TestData.CLIENT_DATA;
    component.client.mainAddress.id = 2;
    bootboxStub.isConfirmedAction = true;
    addressServiceStub.errorOccurred = true;

    component.onRemoveAddress();

    expect(component.addresses.length).toBe(1);
    expect(component.activeAddress).toBe(addressToBeDeleted);
    expect(toastsManagerStub.message).toContain('wrong');
  });
});


