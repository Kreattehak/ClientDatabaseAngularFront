import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastsManager} from 'ng2-toastr';
import {ValidationAndLocaleMessagesService} from '../../app/shared/validation-and-locale-messages.service';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../testdata/stubs/route.stub';
import {ValidationAndLocaleMessagesServiceStub} from '../testdata/stubs/validation-and-locale-messages.service.stub';
import {ToastsManagerStub} from '../testdata/stubs/toasts-manager.stub';
import {RouterStub} from '../testdata/stubs/router.stub';
import {ClientFormComponent} from '../../app/clients/client-form.component';
import {ClientService} from '../../app/clients/client.service';
import {ClientServiceStub} from '../testdata/stubs/client.service.stub';
import {Client} from '../../app/clients/client';
import {TestData} from '../testdata/common/test-data';
import {TestUtils} from '../testdata/common/test-utils';

const activatedRouteStub = new ActivatedRouteStub();
const routerStub = new RouterStub();
const validationServiceStub = new ValidationAndLocaleMessagesServiceStub();
const clientServiceStub = new ClientServiceStub();
const toastsManagerStub = new ToastsManagerStub();

describe('ClientDetailComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
      ],
      declarations: [
        ClientFormComponent,
      ],
      providers: [
        {provide: ClientService, useValue: clientServiceStub},
        {provide: ValidationAndLocaleMessagesService, useValue: validationServiceStub},
        {provide: ToastsManager, useValue: toastsManagerStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: Router, useValue: routerStub}
      ]
    });
    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    activatedRouteStub.resetData();
    validationServiceStub.resetData();
    clientServiceStub.resetData();
    toastsManagerStub.message = '';
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    fixture.detectChanges();

    expect(component.clientForm instanceof FormGroup).toBeTruthy();
  });

  it('form should have proper fields', () => {
    fixture.detectChanges();
    expect(Object.keys(component.clientForm.controls)).toEqual([
      'id', 'firstName', 'lastName'
    ]);
  });

  it('should subscribe to valueChanges and use ValidationService', () => {
    const spy = spyOn(validationServiceStub, 'onValueChanged');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(component.clientForm, component.formErrors);
  });

  it('should populate form with fetched data', () => {
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      client: client
    };
    fixture.detectChanges();

    expect(component.activeClient).toBe(client);
  });

  it('should create form for new client', () => {
    fixture.detectChanges();

    expect(component.activeClient).toBeTruthy();
    expect(component.activeClient.id).toBe(undefined);
  });

  it('should route back to ClientListComponent', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');

    component.onBack();

    expect(spy).toHaveBeenCalledWith(['/clients']);
  }));

  it('should set submitted to true', () => {
    fixture.detectChanges();

    component.onSubmit(1);

    expect(component.submitted).toBeTruthy();
  });

  it('should check for data duplication', () => {
    fixture.detectChanges();
    component.isNewClient = false;

    setActiveClient();
    setClientFormWithDuplicatedData();

    component.onSubmit(1);

    expect(component.submitted).toBeFalsy();
  });

  it('should try to add new client', () => {
    fixture.detectChanges();
    component.isNewClient = true;
    setActiveClient();

    const activeClient = setClientFormWithDuplicatedData();
    const spy = spyOn(clientServiceStub, 'saveNewClient').and.callThrough();

    component.onSubmit(1); // '1' is only used when updating

    expect(spy).toHaveBeenCalledWith(activeClient);
  });

  it('should navigate to AddressForm after client was successfully saved',
    inject([Router], (router: Router) => {
      fixture.detectChanges();
      component.isNewClient = true;
      component.shouldRedirectToAddressForm = true;
      setActiveClient();

      setClientFormWithDuplicatedData();
      const spy = spyOn(router, 'navigate');

      component.onSubmit(1); // '1' is only used when updating

      expect(spy).toHaveBeenCalledWith(['/clients', 1, 'newAddress']);
    }));

  it('should show error when trying to add new address', () => {
    fixture.detectChanges();
    component.isNewClient = true;
    setActiveClient();
    clientServiceStub.errorOccurred = true;

    component.onSubmit(1);

    expect(toastsManagerStub.message).toContain('fakeAnswer');
  });

  it('should show error response when trying to add new client', () => {
    fixture.detectChanges();
    component.isNewClient = true;
    setActiveClient();
    clientServiceStub.errorResponseOccurred = true;

    component.onSubmit(1);

    expect(toastsManagerStub.message).toContain('wrong');
  });

  it('should update existing client', () => {
    fixture.detectChanges();
    component.isNewClient = false;
    setAnotherActiveClient();

    const activeClient = setClientFormWithDuplicatedData();
    const spy = spyOn(clientServiceStub, 'updateClient').and.callThrough();

    component.onSubmit(999);

    activeClient.id = 999;
    expect(spy).toHaveBeenCalledWith(activeClient);
  });

  it('should show error when trying to update existing address', () => {
    fixture.detectChanges();
    component.isNewClient = false;
    setAnotherActiveClient();
    clientServiceStub.errorOccurred = true;

    component.onSubmit(1);

    expect(toastsManagerStub.message).toContain('wrong');
  });

  it('should display legend for new client', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('legend').textContent).toContain('new client');
  });

  it('should display legend for editing client', () => {
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      client: client
    };
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('legend').textContent).toContain(client.firstName);
    expect(compiled.querySelector('legend').textContent).toContain(client.lastName);
  });

  it('should display redirect to new address checkbox for new client', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('input[type="checkbox"]').parentElement.textContent).toContain('forward');
  });

  it('input with type submit should have value add when adding new client', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('input[type="submit"]').value).toContain('Add');
  });

  it('input with type submit should have value edit when editing existing client', () => {
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      client: client
    };
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('input[type="submit"]').value).toContain('Edit');
  });

  it('should disable submit button when input is invalid, e.g. after template init', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('input[type="submit"]').outerHTML).toContain('disabled');
  });

  it('should disable submit button after submit', () => {
    const client = TestData.CLIENT_DATA;
    activatedRouteStub.testData = {
      client: client
    };
    component.submitted = true;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('input[type="submit"]').outerHTML).toContain('disabled');
  });

  it('should display form error messages in paragraphs', () => {
    const errors = TestData.CLIENT_FORM_ERRORS;
    component.formErrors = errors;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    const errorMessageParagraphs = compiled.querySelectorAll('#form-error-messages p');
    expect(errorMessageParagraphs[0].textContent).toContain(errors.firstName);
    expect(errorMessageParagraphs[1].textContent).toContain(errors.lastName);
  });

  it('should validate input fields on blur', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    const firstNameInput = compiled.querySelector('#firstName');
    firstNameInput.dispatchEvent(new Event('blur'));

    // first call to ValidationService happens in ngOnInit()
    expect(validationServiceStub.timesCalled).toBe(2);
  });

  function setActiveClient() {
    component.activeClient = TestData.CLIENT_DATA;
  }

  function setAnotherActiveClient() {
    component.activeClient = {
      id: 1,
      firstName: 'Another Name',
      lastName: 'Another LastName',
      dateOfRegistration: '11-11-1111',
      mainAddress: null
    };
  }

  function setClientFormWithDuplicatedData() {
    return <Client>TestUtils.setFormWithDuplicatedData(TestData.CLIENT_FORM_DATA, component.clientForm);
  }
});
