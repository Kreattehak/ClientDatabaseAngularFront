import {Injectable} from '@angular/core';
import {Toast} from 'ng2-toastr';

@Injectable()
export class ToastsManagerStub {
  success(message, title, options): Promise<Toast> {
    return new Promise((resolve, reject) => {
      // do nothing
    });
  }

  error(message, title, options): Promise<Toast> {
    return new Promise((resolve, reject) => {
      // do nothing
    });
  }
}
