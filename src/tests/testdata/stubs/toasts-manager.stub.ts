import {Injectable} from '@angular/core';
import {Toast} from 'ng2-toastr';

@Injectable()
export class ToastsManagerStub {
  public message: string;

  success(message, title, options): Promise<Toast> {
    this.message = message;
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  error(message, title, options): Promise<Toast> {
    this.message = message;
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
