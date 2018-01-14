import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable()
export class ValidationAndLocaleMessagesServiceStub {
  getLocalizedMessages(data: string): string {
    return 'fakeAnswer';
  }

  onValueChanged(form: FormGroup, formErrors: {}, data ?: any): void {
  }

  setCookie(): void {

  }
}
