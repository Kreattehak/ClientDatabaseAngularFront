import {AddressDetailResolver} from './address-detail-resolver.service';
import {AddressServiceStub} from '../../test/address.service.stub';
import {AddressService} from './address.service';
import {inject, TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Address} from './address';

const addressServiceStub = new AddressServiceStub();

describe('AddressDetailResolverTests', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(({
      providers: [
        AddressDetailResolver,
        {provide: AddressService, useValue: addressServiceStub},
      ]
    }));
  });

  it('should resolve addresses', inject([AddressDetailResolver], (resolver: AddressDetailResolver) => {
    const activatedRouteSnapshot = new ActivatedRouteSnapshot();
    const expectedId = 1;
    spyOn(activatedRouteSnapshot.paramMap, 'get').and.returnValue(expectedId);

    const data = resolver.resolve(activatedRouteSnapshot);

    data.subscribe((addresses: Address[]) => {
      expect(addresses.length).toBe(1);
      expect(addresses[0].id).toBe(expectedId);
    });
  }));
});
