import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Client} from './client';
import {ClientService} from './client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';

declare var bootbox: any;

@Component({
  templateUrl: 'client-list.component.html'
})
export class ClientListComponent implements OnInit {

  private clients: Client[];
  public filteredClients: Client[];
  public activeClient: Client;
  private _filter: string;
  public errorMessage = 'Please wait while data is being resolved.';

  constructor(private _clientService: ClientService, private _router: Router,
              private _route: ActivatedRoute, private _toastr: ToastsManager,
              private vcr: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.generateTable();
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
    console.log(filterBy);
    if (filterBy.length === 2) {
      return this.clients.filter((client: Client) => {
        return client.firstName.toLocaleLowerCase().indexOf(filterBy[0]) !== -1
          && client.lastName.toLocaleLowerCase().indexOf(filterBy[1]) !== -1;
      });
    } else if (filterBy.length === 1) {
      return this.clients.filter((client: Client) => {
        return client.firstName.toLocaleLowerCase().indexOf(filter) !== -1
          || client.lastName.toLocaleLowerCase().indexOf(filter) !== -1;
      });
    } else {
      return null;
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
      this._router.navigate(['/clients', 'details', this.activeClient.id]);
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

  private removeConfirm(): void {
    if (!JSON.parse(localStorage.getItem('currentUser'))) {
      this._router.navigate(['/login']);
      return;
    }
    bootbox.confirm({
      title: 'Delete client',
      message: 'Do you want to remove selected client?',
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> Cancel'
        },
        confirm: {
          label: '<i class="fa fa-check"></i> Confirm'
        }
      },
      callback: (result) => {
        if (result) {
          this._clientService.deleteClient(this.activeClient).subscribe(
            response => {
              const data = this.clients.filter(client => client !== this.activeClient);
              this.clients = data;
              this.filteredClients = data;
              this._toastr.success(response, 'Success!');
              this.activeClient = null;
            }, error => this._toastr.error(error, 'Error!')
          );
          return true;
        } else {
          return;
        }
      }
    });
  }

  onEditClient(): boolean {
    if (!this.isFieldSelected()) {
      return false;
    } else {
      this._router.navigate(['/clients', this.activeClient.id]);
      return true;
    }
  }

  private generateTable(): void {
    // this.clients = this._route.snapshot.data['clients'];
    // this.filteredClients = this.clients;
    this._clientService.getAllClients().subscribe(
      clients => {
        this.clients = clients;
        this.filteredClients = this.clients;
      }, error => {
        this.errorMessage = 'Server is offline.';
        this._toastr.error(this.errorMessage, 'Error!');
      });
  }

  private isFieldSelected(): boolean {
    if (!this.activeClient) {
      bootbox.alert({
        message: 'Please select a row',
        size: 'small',
        backdrop: true
      });
      return false;
    }
    return true;
  }
}
