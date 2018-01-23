import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable()
export class ValidationAndLocaleMessagesServiceStub {
  public timesCalled = 0;

  getLocalizedMessages(data: string): string {
    if (data === 'dataBeingResolved') {
      return 'dataIsBeingResolved';
    } else {
      return 'fakeAnswer';
    }
  }

  onValueChanged(form: FormGroup, formErrors: {}, data ?: any): void {
    this.timesCalled++;
  }

  setCookie(): void {
    // do nothing
  }

  resetData(): void {
    this.timesCalled = 0;
  }
}
