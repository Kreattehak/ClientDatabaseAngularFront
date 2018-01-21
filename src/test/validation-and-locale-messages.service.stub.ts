import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable()
export class ValidationAndLocaleMessagesServiceStub {
  getLocalizedMessages(data: string): string {
    if (data === 'dataBeingResolved') {
      return 'dataIsBeingResolved';
    } else {
      return 'fakeAnswer';
    }
  }

  onValueChanged(form: FormGroup, formErrors: {}, data ?: any): void {
  }

  setCookie(): void {
    // do nothing
  }
}
