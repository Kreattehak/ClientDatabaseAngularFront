import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {ClientListComponent} from './client-list.component';
import {ClientService} from './client.service';
import {BOOTBOX_TOKEN} from '../utils/bootbox';
import {ToastsManager} from 'ng2-toastr/src/toast-manager';
import {Router} from '@angular/router';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterStub} from '../../test/router.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../../test/validation-and-locale-messages.service.stub';
import {ClientServiceStub} from '../../test/client.service.stub';
import {ToastsManagerStub} from '../../test/toasts-manager.stub';
import {BootboxStub} from '../../test/bootbox.stub';
import {FormsModule} from '@angular/forms';
import {CLIENT_DATA} from '../../test/test-utils';

const clientServiceStub = new ClientServiceStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const toastsManagerStub = new ToastsManagerStub();
const routerStub = new RouterStub();
const bootboxStub = new BootboxStub();

describe('ClientListComponentTests', () => {
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
      ]
    });
    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    toastsManagerStub.message = '';
    clientServiceStub.resetData();
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
    expect(component.filteredClients).toContain(CLIENT_DATA);
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
    component.markAsActive(CLIENT_DATA);

    expect(component.activeClient).toBe(CLIENT_DATA);
  });

  it('should delete active mark from table row', () => {
    component.activeClient = CLIENT_DATA;

    component.markAsActive(CLIENT_DATA);

    expect(component.activeClient).toBe(null);
  });

  it('should navigate to ClientDetailComponent after clicking info button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.activeClient = CLIENT_DATA;

      component.onInfo();

      expect(spy).toHaveBeenCalledWith(['/clients', CLIENT_DATA.id, 'details']);

    }));

  it('should block navigation to ClientDetailComponent when table row is not selected', () => {
    component.onInfo();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should navigate to ClientFormComponent after clicking edit button',
    inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.activeClient = CLIENT_DATA;

      component.onEditClient();

      expect(spy).toHaveBeenCalledWith(['/clients', CLIENT_DATA.id]);

    }));

  it('should block navigation to ClientFormComponent when table row is not selected', () => {
    component.onEditClient();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });


  it('should check if user is logged before undertake an delete client action',
    inject([Router], (router: Router) => {
      component.activeClient = CLIENT_DATA;
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const spy = spyOn(router, 'navigate');

      component.onRemove();

      expect(spy).toHaveBeenCalledWith(['/login']);
    }));

  it('should use bootbox for user confirmation', () => {
    fixture.detectChanges();
    component.activeClient = CLIENT_DATA;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');

    component.onRemove();

    expect(bootboxStub.message).toContain('fakeAnswer');
  });

  it('should perform delete client action', () => {
    fixture.detectChanges();
    component.activeClient = CLIENT_DATA;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');
    bootboxStub.isConfirmedAction = true;

    component.onRemove();

    expect(component.activeClient).toBe(null);
    expect(component.filteredClients.length).toBe(0);
    expect(toastsManagerStub.message).toContain('fine');
  });

  it('should perform delete client action, server side error response', () => {
    fixture.detectChanges();
    component.activeClient = CLIENT_DATA;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');
    bootboxStub.isConfirmedAction = true;
    clientServiceStub.errorOccurred = true;

    component.onRemove();

    expect(component.activeClient).toBe(CLIENT_DATA);
    expect(component.filteredClients.length).toBe(1);
    expect(toastsManagerStub.message).toContain('wrong');
  });

  it('after deleting client, should check if array is not empty', () => {
    fixture.detectChanges();
    component.activeClient = CLIENT_DATA;
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
    component.activeClient = CLIENT_DATA;
    spyOn(localStorage, 'getItem').and.returnValue('"someData"');

    component.onRemove();

    expect(component.filteredClients.length).toBe(1);
    expect(component.activeClient).toBe(CLIENT_DATA);
  });
});
