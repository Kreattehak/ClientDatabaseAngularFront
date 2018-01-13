import {MockBackend, MockConnection} from '@angular/http/testing';
import {Response, ResponseOptions} from '@angular/http';
import {MockError} from './mock-error';

export const ADDRESS_DATA = {
  id: 1,
  streetName: 'street',
  cityName: 'city',
  zipCode: '44-444'
};
export const CLIENT_DATA = {
  id: 1,
  firstName: 'Fake',
  lastName: 'User',
  dateOfRegistration: '11-05-1974',
  mainAddress: ADDRESS_DATA
};

export class TestUtils {

  static createResponse(mockBackend: MockBackend, data: any): void {
    const response = new ResponseOptions({
      body: JSON.stringify(data)
    });
    const baseResponse: Response = new Response(response);
    mockBackend.connections.subscribe(
      (c: MockConnection) => c.mockRespond(baseResponse)
    );
  }

  static createError(mockBackend: MockBackend, body: string): void {
    const response = new ResponseOptions({
      status: 401,
      body: body
    });
    const baseError: Error = new MockError(response);
    mockBackend.connections.subscribe(
      (c: MockConnection) => c.mockError(baseError)
    );
  }
}

