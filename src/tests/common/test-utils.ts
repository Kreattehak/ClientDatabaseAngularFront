import {MockBackend, MockConnection} from '@angular/http/testing';
import {Response, ResponseOptions} from '@angular/http';
import {MockError} from '../stubs/mock-error';
import {FormGroup} from '@angular/forms';

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

  static createError(mockBackend: MockBackend, body: string, status: number): void {
    const response = new ResponseOptions({
      status: status,
      body: body
    });
    const baseError: Error = new MockError(response);
    mockBackend.connections.subscribe(
      (c: MockConnection) => c.mockError(baseError)
    );
  }

  static setFormWithDuplicatedData(duplicatedData: {}, form: FormGroup): any {
    const data = {...duplicatedData}; // prevent tests model object to change
    form.setValue(data);

    return data;
  }
}

