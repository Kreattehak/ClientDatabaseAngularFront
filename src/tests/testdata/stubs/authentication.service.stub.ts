import {Observable} from 'rxjs/Observable';

export class AuthenticationServiceStub {
  public errorOccurred = false;
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

  getToken(): string {
    return 'fakeToken';
  }

  getUserName(): string {
    return 'fakeUserName';
  }

  resetData(): void {
    this.errorOccurred = false;
    this.logoutMethodCallsCounter = 0;
  }
}
