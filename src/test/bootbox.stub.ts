import {Injectable} from '@angular/core';

@Injectable()
export class BootboxStub {
  public message: string;

  alert(data: any): void {
    this.message = data.message;
  }

  resetData(): void {
    this.message = '';
  }
}
