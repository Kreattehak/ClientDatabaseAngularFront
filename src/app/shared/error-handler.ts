import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

export class ErrorHandler {
  public static handleError(error: Response): ErrorObservable {
    let errorMessage: any;
    try {
      errorMessage = error.json().errorMessage;
    } catch (e) {
      errorMessage = error.text();
    }
    return Observable.throw(errorMessage || 'Server error');
  }
}
