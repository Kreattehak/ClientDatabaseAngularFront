import {Injectable} from '@angular/core';

@Injectable()
export class BootboxStub {
  public message: string;
  public isConfirmedAction = false;

  alert(data: any): void {
    this.message = data.message;
  }

  confirm(data: any): void {
    this.message = data.message;
    data.callback(this.isConfirmedAction);
  }

  resetData(): void {
    this.message = '';
    this.isConfirmedAction = false;
  }
}
