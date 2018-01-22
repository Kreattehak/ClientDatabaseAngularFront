import {inject, TestBed} from '@angular/core/testing';
import {AuthenticationServiceStub} from '../testdata/stubs/authentication.service.stub';
import {AuthenticationService} from '../../app/login/authentication.service';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {ClientService} from '../../app/clients/client.service';
import {Client} from '../../app/clients/client';
import {TestUtils} from '../testdata/common/test-utils';
import {TestData} from '../testdata/common/test-data';

const authenticationServiceStub = new AuthenticationServiceStub();

describe('ClientServiceTests', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(({
      providers: [
        ClientService,
        {provide: AuthenticationService, useValue: authenticationServiceStub},
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ]
    }));
  });

  it('should get all clients', inject([ClientService, MockBackend],
    (clientService: ClientService, mockBackend: MockBackend) => {
      TestUtils.createResponse(mockBackend, [TestData.CLIENT_DATA]);
      const expectedResult = 1;

      clientService.getAllClients().subscribe((clients: Client[]) => {
        expect(clients.length).toBe(expectedResult);
        expect(clients[0].id).toBe(expectedResult);
      });
    }));

  it('should delete given client', inject([ClientService, MockBackend],
    (clientService: ClientService, mockBackend: MockBackend) => {
      const expectedResponse = 'Client deleted';
      TestUtils.createResponse(mockBackend, expectedResponse);

      clientService.deleteClient(TestData.CLIENT_DATA).subscribe((response: string) => {
        expect(response).toContain(expectedResponse);
      });
    }));

  it('should update existing client', inject([ClientService, MockBackend],
    (clientService: ClientService, mockBackend: MockBackend) => {
      const expectedResponse = 'Client updated';
      TestUtils.createResponse(mockBackend, expectedResponse);

      clientService.updateClient(TestData.CLIENT_DATA).subscribe((response: string) => {
        expect(response).toContain(expectedResponse);
      });
    }));

  it('should get client', inject([ClientService, MockBackend],
    (clientService: ClientService, mockBackend: MockBackend) => {
      TestUtils.createResponse(mockBackend, TestData.CLIENT_DATA);

      clientService.getClient(1).subscribe((client: Client) => {
        expect(client.id).toBe(TestData.CLIENT_DATA.id);
      });
    }));

  it('should save new client', inject([ClientService, MockBackend],
    (clientService: ClientService, mockBackend: MockBackend) => {
      const expectedResponse = Number(TestData.CLIENT_DATA.id);
      TestUtils.createResponse(mockBackend, expectedResponse);

      clientService.saveNewClient(TestData.CLIENT_DATA).subscribe((newClientId: number) => {
        expect(newClientId).toBe(expectedResponse);
      });
    }));

  it('should catch error', inject([ClientService, MockBackend],
    (clientService: ClientService, mockBackend: MockBackend) => {
      const bodyMessage = 'Unauthorized';
      TestUtils.createError(mockBackend, bodyMessage, 401);

      clientService.getClient(1).subscribe(
        null,
        (error: string) => {
          expect(error).toContain(bodyMessage);
        });
    }));
});
