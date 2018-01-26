import {ClientDetailComponent} from '../../app/clients/client-detail.component';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {AddressService} from '../../app/addresses/address.service';
import {ValidationAndLocaleMessagesService} from '../../app/shared/validation-and-locale-messages.service';
import {ToastsManager} from 'ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AddressServiceStub} from '../testdata/stubs/address.service.stub';
import {ToastsManagerStub} from '../testdata/stubs/toasts-manager.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../testdata/stubs/validation-and-locale-messages.service.stub';
import {RouterStub} from '../testdata/stubs/router.stub';
import {BootboxStub} from '../testdata/stubs/bootbox.stub';
import {BOOTBOX_TOKEN} from '../../app/utils/bootbox';
import {ActivatedRouteStub} from '../testdata/stubs/route.stub';
import {TestData} from '../testdata/common/test-data';
import {DatePipe} from '@angular/common';

const addressServiceStub = new AddressServiceStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const toastsManagerStub = new ToastsManagerStub();
const activatedRouteStub = new ActivatedRouteStub();
const routerStub = new RouterStub();
const bootboxStub = new BootboxStub();

describe('ClientDetailComponent', () => {
  let component: ClientDetailComponent;
  let fixture: ComponentFixture<ClientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        DatePipe
      ]
    });
    fixture = TestBed.createComponent(ClientDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    addressServiceStub.resetData();
    validationServiceStub.resetData();
    toastsManagerStub.message = '';
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

  it('should navigate to AddressFormComponent after clicking add address button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.client = TestData.CLIENT_DATA;

      component.onAddAddress();

      expect(spy).toHaveBeenCalledWith(['/clients', component.client.id, 'newAddress']);
    }));

  it('should navigate to AddressFormComponent after clicking edit address button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.client = TestData.CLIENT_DATA;
      component.activeAddress = TestData.ADDRESS_DATA;

      component.onEditAddress();

      expect(spy).toHaveBeenCalledWith(['/clients',
        component.client.id, 'address', component.activeAddress.id]);
    }));

  it('should block navigation to AddressFormComponent when table row is not selected', () => {
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

  it('should display client data', inject([DatePipe], (datePipe: DatePipe) => {
    const client = TestData.CLIENT_DATA;
    const address = TestData.ADDRESS_DATA;
    activatedRouteStub.testData = {
      client: client,
      addresses: [address]
    };
    fixture.detectChanges();

    const header = fixture.debugElement.nativeElement.querySelector('h2').textContent;
    const paragraphs = fixture.debugElement.nativeElement.querySelectorAll('.jumbotron p');

    expect(header).toContain(client.firstName);
    expect(header).toContain(client.lastName);

    expect(paragraphs[0].textContent).toContain(datePipe.transform(client.dateOfRegistration, 'dd.MM.y'));
    expect(paragraphs[1].textContent).toContain(client.mainAddress.cityName);

    expect(paragraphs[1].textContent).toContain(client.mainAddress.streetName);
    expect(paragraphs[1].textContent).toContain(client.mainAddress.zipCode);
  }));

  it('should display addresses in a table', () => {
    const client = TestData.CLIENT_DATA;
    const address = TestData.ADDRESS_DATA;
    activatedRouteStub.testData = {
      client: client,
      addresses: [address]
    };
    fixture.detectChanges();

    const table = fixture.debugElement.nativeElement.querySelector('tbody tr').textContent;

    expect(table).toContain(address.id);
    expect(table).toContain(address.cityName);
    expect(table).toContain(address.streetName);
    expect(table).toContain(address.zipCode);
  });

  it('should display message when client has no no addresses', () => {
    activatedRouteStub.testData = {
      client: TestData.CLIENT_DATA,
      addresses: []
    };
    fixture.detectChanges();

    const paragraph = fixture.debugElement.nativeElement.querySelector('.jumbotron p').textContent;
    expect(paragraph).toContain('any addresses');
  });
});


