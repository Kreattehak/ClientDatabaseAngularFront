import {NavigationExtras} from '@angular/router';

export class RouterStub {
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true);
  }
}
