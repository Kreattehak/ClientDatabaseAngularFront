import {inject, TestBed} from '@angular/core/testing';
import {AuthenticationServiceStub} from '../../test/authentication.service.stube';
import {AuthenticationService} from '../login/authentication.service';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {ClientService} from './client.service';
import {Client} from './client';
import {CLIENT_DATA, TestUtils} from '../../test/test-utils';

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
    (clientService, mockBackend) => {
      TestUtils.createResponse(mockBackend, [CLIENT_DATA]);
      const expectedResult = 1;

      clientService.getAllClients(1).subscribe((clients: Client[]) => {
        expect(clients.length).toBe(expectedResult);
        expect(clients[0].id).toBe(expectedResult);
      });
    }));

  it('should delete given client', inject([ClientService, MockBackend],
    (clientService, mockBackend) => {
      const expectedResponse = 'Client deleted';
      TestUtils.createResponse(mockBackend, expectedResponse);

      clientService.deleteClient(CLIENT_DATA).subscribe((response: string) => {
        expect(response).toContain(expectedResponse);
      });
    }));

  it('should update existing client', inject([ClientService, MockBackend],
    (clientService, mockBackend) => {
      const expectedResponse = 'Client updated';
      TestUtils.createResponse(mockBackend, expectedResponse);

      clientService.updateClient(CLIENT_DATA).subscribe((response: string) => {
        expect(response).toContain(expectedResponse);
      });
    }));

  it('should get client', inject([ClientService, MockBackend],
    (clientService, mockBackend) => {
      TestUtils.createResponse(mockBackend, CLIENT_DATA);

      clientService.getClient(1).subscribe((client: Client) => {
        expect(client.id).toBe(CLIENT_DATA.id);
      });
    }));

  it('should save new client', inject([ClientService, MockBackend],
    (clientService, mockBackend) => {
      const expectedResponse = Number(CLIENT_DATA.id);
      TestUtils.createResponse(mockBackend, expectedResponse);

      clientService.saveNewClient(CLIENT_DATA).subscribe((newClientId: number) => {
        expect(newClientId).toBe(expectedResponse);
      });
    }));

  it('should catch error', inject([ClientService, MockBackend],
    (clientService, mockBackend) => {
      const bodyMessage = 'Unauthorized';
      TestUtils.createError(mockBackend, bodyMessage);

      clientService.getClient(1).subscribe(
        (client: Client) => {
        },
        (error: string) => {
          expect(error).toContain(bodyMessage);
        });
    }));
});
