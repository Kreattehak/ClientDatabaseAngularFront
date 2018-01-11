import {Observable} from 'rxjs/Observable';

export class AuthenticationServiceStub {
  public errorOccurred: boolean;
  public logoutMethodCallsCounter: number;

  login(username: string, password: string): Observable<boolean> {
    if (this.errorOccurred) {
      return Observable.throw('Something went wrong!');
    } else {
      return Observable.of(true);
    }
  }

  logout(): void {
    this.logoutMethodCallsCounter++;
  }

  resetData(): void {
    this.errorOccurred = false;
    this.logoutMethodCallsCounter = 0;
  }
}
