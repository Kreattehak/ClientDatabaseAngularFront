import {Component, OnDestroy, OnInit} from '@angular/core';
import {Client} from './client';
import {ClientService} from './client.service';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {Subject} from 'rxjs/Subject';

declare const bootbox: any;

@Component({
  templateUrl: 'client-list.component.html'
})
export class ClientListComponent implements OnInit, OnDestroy {

  public filteredClients: Client[];
  public activeClient: Client;
  public errorMessage = this._validationService.getLocalizedMessages('dataBeingResolved');

  private _filter: string;
  private clients: Client[];
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _clientService: ClientService, private _router: Router,
              private _validationService: ValidationAndLocaleMessagesService,
              private _toastr: ToastsManager) {
  }

  ngOnInit() {
    this.generateTable();
    this._validationService.setCookie();
  }

  get filter(): string {
    return this._filter;
  }

  set filter(value: string) {
    this._filter = value;
    this.filteredClients = this.filter ? this.performFilter(this.filter) : this.clients;
  }

  private performFilter(filter: string): Client[] {
    filter = filter.toLocaleLowerCase();
    const filterBy: string[] = filter.split(/\s/);
    let filteredClients: Client[] = [];

    if (filterBy.length === 2) {
      filteredClients = this.filterFirstAndLastNameSeparately(filterBy);
    } else if (filterBy.length === 1) {
      filteredClients = this.filterFirstAndLastNameSimultaneously(filter);
    }
    if (filteredClients.length === 0) {
      this.errorMessage = this._validationService.getLocalizedMessages('noMatchForFilter');
      return null;
    } else {
      return filteredClients;
    }
  }

  markAsActive(activeRow: Client): void {
    if (this.activeClient === activeRow) {
      this.activeClient = null;
    } else {
      this.activeClient = activeRow;
    }
    // this.activeClient = this.activeClient === activeRow ? null : activeRow;
  }

  onInfo(): boolean {
    if (!this.isFieldSelected()) {
      return false;
    } else {
      this._router.navigate(['/clients', this.activeClient.id, 'details']);
      return true;
    }
  }

  onEditClient(): boolean {
    if (!this.isFieldSelected()) {
      return false;
    } else {
      this._router.navigate(['/clients', this.activeClient.id]);
      return true;
    }
  }

  onRemove(): boolean {
    if (!this.isFieldSelected()) {
      return false;
    } else {
      this.removeConfirm();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private filterFirstAndLastNameSeparately(filterBy: string[]): Client[] {
    return this.clients.filter((client: Client) => {
      return client.firstName.toLocaleLowerCase().indexOf(filterBy[0]) !== -1
        && client.lastName.toLocaleLowerCase().indexOf(filterBy[1]) !== -1;
    });
  }

  private filterFirstAndLastNameSimultaneously(filter: string): Client[] {
    return this.clients.filter((client: Client) => {
      return client.firstName.toLocaleLowerCase().indexOf(filter) !== -1
        || client.lastName.toLocaleLowerCase().indexOf(filter) !== -1;
    });
  }

  private removeConfirm(): void {
    if (!JSON.parse(localStorage.getItem('currentUser'))) {
      this._router.navigate(['/login']);
      return;
    }
    bootbox.confirm({
      title: this._validationService.getLocalizedMessages('removeClientConfirmTitle'),
      message: this._validationService.getLocalizedMessages('removeClientConfirmMessage'),
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> ' + this._validationService.getLocalizedMessages('cancelAction')
        },
        confirm: {
          label: '<i class="fa fa-check"></i> ' + this._validationService.getLocalizedMessages('confirmAction')
        }
      },
      callback: this.removeClient
    });
  }

  private removeClient = (result) => {
    if (result) {
      this._clientService.deleteClient(this.activeClient)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          response => {
            const data = this.clients.filter(client => client !== this.activeClient);
            this.clients = data;
            this.filteredClients = data;
            this.activeClient = null;
            this._toastr.success(response, this._validationService.getLocalizedMessages('successTitle'));
            this.checkArrayForClients();
          }, error => this._toastr.error(error, this._validationService.getLocalizedMessages('errorTitle'))
        );
      return true;
    } else {
      return;
    }
  };

  private generateTable(): void {
    this._clientService.getAllClients()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
      clients => {
        this.clients = clients;
        this.filteredClients = this.clients;
        this.checkArrayForClients();
      }, error => {
        this.errorMessage = this._validationService.getLocalizedMessages('serverOffline');
        this._toastr.error(this.errorMessage, this._validationService.getLocalizedMessages('errorTitle'));
      });
  }

  private checkArrayForClients(): void {
    if (this.clients.length === 0) {
      this.errorMessage = this._validationService.getLocalizedMessages('emptyDatabase');
    }
  }

  private isFieldSelected(): boolean {
    if (!this.activeClient) {
      bootbox.alert({
        message: this._validationService.getLocalizedMessages('rowNotSelected'),
        size: 'small',
        backdrop: true
      });
      return false;
    }
    return true;
  }
}
