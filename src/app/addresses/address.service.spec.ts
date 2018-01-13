import {inject, TestBed} from '@angular/core/testing';
import {AuthenticationServiceStub} from '../../test/authentication.service.stube';
import {AuthenticationService} from '../login/authentication.service';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {AddressService} from './address.service';
import {Address} from './address';
import {ADDRESS_DATA, TestUtils} from '../../test/test-utils';

const authenticationServiceStub = new AuthenticationServiceStub();

describe('AddressServiceTests', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(({
      providers: [
        AddressService,
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

  it('should get all addresses', inject([AddressService, MockBackend],
    (addressService, mockBackend) => {
      TestUtils.createResponse(mockBackend, [ADDRESS_DATA]);
      const expectedResult = 1;

      addressService.getAllAddresses(1).subscribe((addresses: Address[]) => {
        expect(addresses.length).toBe(expectedResult);
        expect(addresses[0].id).toBe(expectedResult);
      });
    }));

  it('should save new address', inject([AddressService, MockBackend],
    (addressService, mockBackend) => {
      const clientId = 1;
      const expectedResponse = Number(ADDRESS_DATA.id);
      TestUtils.createResponse(mockBackend, expectedResponse);

      addressService.saveNewAddress(ADDRESS_DATA, clientId).subscribe((newAddressId: number) => {
        expect(newAddressId).toBe(expectedResponse);
      });
    }));

  it('should update existing address', inject([AddressService, MockBackend],
    (addressService, mockBackend) => {
      const expectedResponse = 'Address updated';
      TestUtils.createResponse(mockBackend, expectedResponse);

      addressService.updateAddress(ADDRESS_DATA).subscribe((response: string) => {
        expect(response).toContain(expectedResponse);
      });
    }));

  it('should delete existing address', inject([AddressService, MockBackend],
    (addressService, mockBackend) => {
      const expectedResponse = 'Address deleted';
      const clientId = 1;
      TestUtils.createResponse(mockBackend, expectedResponse);

      addressService.deleteAddress(ADDRESS_DATA.id, clientId).subscribe((response: string) => {
        expect(response).toContain(expectedResponse);
      });
    }));

  it('should set address as main address', inject([AddressService, MockBackend],
    (addressService, mockBackend) => {
      const expectedResponse = 'Address changed';
      const clientId = 1;
      TestUtils.createResponse(mockBackend, expectedResponse);

      addressService.setAsMainAddress(ADDRESS_DATA.id, clientId).subscribe((response: string) => {
        expect(response).toContain(expectedResponse);
      });
    }));

  it('should catch error', inject([AddressService, MockBackend],
    (addressService, mockBackend) => {
      const bodyMessage = 'Unauthorized';
      TestUtils.createError(mockBackend, bodyMessage);

      addressService.getAllAddresses(1).subscribe(
        () => {},
        (error: string) => {
          expect(error).toContain(bodyMessage);
        });
    }));
});