import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {ClientListComponent} from '../../app/clients/client-list.component';
import {ClientService} from '../../app/clients/client.service';
import {BOOTBOX_TOKEN} from '../../app/utils/bootbox';
import {ToastsManager} from 'ng2-toastr/src/toast-manager';
import {Router} from '@angular/router';
import {ValidationAndLocaleMessagesService} from '../../app/shared/validation-and-locale-messages.service';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterStub} from '../testdata/stubs/router.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../testdata/stubs/validation-and-locale-messages.service.stub';
import {ClientServiceStub} from '../testdata/stubs/client.service.stub';
import {ToastsManagerStub} from '../testdata/stubs/toasts-manager.stub';
import {BootboxStub} from '../testdata/stubs/bootbox.stub';
import {FormsModule} from '@angular/forms';
import {TestData} from '../testdata/common/test-data';
import {DatePipe} from '@angular/common';

const clientServiceStub = new ClientServiceStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const toastsManagerStub = new ToastsManagerStub();
const routerStub = new RouterStub();
const bootboxStub = new BootboxStub();

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        FormsModule
      ],
      declarations: [
        ClientListComponent,
      ],
      providers: [
        {provide: ClientService, useValue: clientServiceStub},
        {provide: ValidationAndLocaleMessagesService, useValue: validationServiceStub},
        {provide: ToastsManager, useValue: toastsManagerStub},
        {provide: Router, useValue: routerStub},
        {provide: BOOTBOX_TOKEN, useValue: bootboxStub},
        DatePipe
      ]
    });
    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    clientServiceStub.resetData();
    validationServiceStub.resetData();
    toastsManagerStub.message = '';
    bootboxStub.resetData();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('after init should set cookie', () => {
    const spy = spyOn(validationServiceStub, 'setCookie');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should fetch data from server on init', () => {
    fixture.detectChanges();

    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients).toContain(TestData.CLIENT_DATA);
  });

  it('should show message when database is empty', () => {
    clientServiceStub.errorOccurred = true;
    fixture.detectChanges();

    expect(component.filteredClients.length).toBe(0);
    expect(component.errorMessage).toContain('fakeAnswer');
  });

  it('should show message when error occurred', () => {
    clientServiceStub.errorResponseOccurred = true;
    fixture.detectChanges();

    expect(component.errorMessage).toContain('fakeAnswer');
    expect(toastsManagerStub.message).toContain('fakeAnswer');
  });

  it('should set filteredClients to null when filter doesn`t match any data', () => {
    fixture.detectChanges();
    component.filter = 'someUser';

    expect(component.filteredClients).toBe(null);
    expect(component.errorMessage).toContain('fakeAnswer');
  });

  it('should perform filtering first name', () => {
    fixture.detectChanges();
    component.filter = 'Fake';

    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients[0].firstName).toContain('Fake');
  });

  it('should perform filtering last name', () => {
    fixture.detectChanges();
    component.filter = 'User';

    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients[0].lastName).toContain('User');
  });

  it('should perform filtering both last and first name and ignore case', () => {
    fixture.detectChanges();
    component.filter = 'fake user';

    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients[0].firstName).toContain('Fake');
    expect(component.filteredClients[0].lastName).toContain('User');
  });

  it('should return empty array when input contains more than two words', () => {
    fixture.detectChanges();
    component.filter = 'fake user fake';

    expect(component.filteredClients).toBe(null);
  });

  it('should set active client after selecting a row', () => {
    const client = TestData.CLIENT_DATA;

    component.markAsActive(client);

    expect(component.activeClient).toBe(client);
  });

  it('should delete active mark from table row', () => {
    const client = TestData.CLIENT_DATA;
    component.activeClient = client;

    component.markAsActive(client);

    expect(component.activeClient).toBe(null);
  });

  it('should navigate to ClientDetailComponent after clicking info button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.activeClient = TestData.CLIENT_DATA;

      component.onInfo();

      expect(spy).toHaveBeenCalledWith(['/clients', component.activeClient.id, 'details']);

    }));

  it('should block navigation to ClientDetailComponent when table row is not selected', () => {
    component.onInfo();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should navigate to ClientFormComponent after clicking edit button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.activeClient = TestData.CLIENT_DATA;

      component.onEditClient();

      expect(spy).toHaveBeenCalledWith(['/clients', component.activeClient.id]);

    }));

  it('should block navigation to ClientFormComponent when table row is not selected', () => {
    component.onEditClient();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });


  it('should check if user is logged before undertake an delete client action',
    inject([Router], (router: Router) => {
      component.activeClient = TestData.CLIENT_DATA;
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const spy = spyOn(router, 'navigate');

      component.onRemove();

      expect(spy).toHaveBeenCalledWith(['/login']);
    }));

  it('should use bootbox for user confirmation', () => {
    fixture.detectChanges();
    component.activeClient = TestData.CLIENT_DATA;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');

    component.onRemove();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should perform delete client action', () => {
    fixture.detectChanges();
    component.activeClient = clientServiceStub.returnedClient;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');
    bootboxStub.isConfirmedAction = true;

    component.onRemove();

    expect(component.activeClient).toBe(null);
    expect(component.filteredClients.length).toBe(0);
    expect(toastsManagerStub.message).toContain('fine');
  });

  it('should perform delete client action, server side error response', () => {
    fixture.detectChanges();
    const client = TestData.CLIENT_DATA;
    component.activeClient = client;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');
    bootboxStub.isConfirmedAction = true;
    clientServiceStub.errorOccurred = true;

    component.onRemove();

    expect(component.activeClient).toBe(client);
    expect(component.filteredClients.length).toBe(1);
    expect(toastsManagerStub.message).toContain('wrong');
  });

  it('after deleting client, should check if array is not empty', () => {
    fixture.detectChanges();
    component.activeClient = clientServiceStub.returnedClient;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');
    bootboxStub.isConfirmedAction = true;

    component.onRemove();
    expect(component.errorMessage).toContain('fakeAnswer');
  });

  it('should not delete any row from clients table when table row is not selected', () => {
    component.onRemove();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should not delete any row from clients table without user confirmation', () => {
    fixture.detectChanges();
    const client = TestData.CLIENT_DATA;
    component.activeClient = client;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');

    component.onRemove();

    expect(component.filteredClients.length).toBe(1);
    expect(component.activeClient).toBe(client);
  });

  it('should display addresses in a table', inject([DatePipe], (datePipe: DatePipe) => {
    const client = TestData.CLIENT_DATA;
    fixture.detectChanges();

    const table = fixture.debugElement.nativeElement.querySelector('tbody tr').textContent;

    expect(table).toContain(client.id);
    expect(table).toContain(client.firstName);
    expect(table).toContain(client.lastName);
    expect(table).toContain(datePipe.transform(client.dateOfRegistration, 'dd.MM.y'));
    expect(table).toContain(client.mainAddress.cityName);
  }));

  it('should display message when server returned empty array', () => {
    clientServiceStub.errorOccurred = true;
    fixture.detectChanges();

    const paragraph = fixture.debugElement.nativeElement.querySelector('.jumbotron p').textContent;
    expect(paragraph).toContain('fake');
  });
});
