import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ClientService} from './client.service';
import {AddressService, LAST_AVAILABLE_ADDRESS} from '../addresses/address.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from './client';
import {Address} from '../addresses/address';
import {ToastsManager} from 'ng2-toastr';

declare var bootbox: any;

@Component({
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent implements OnInit {

  public client: Client;
  public addresses: Address[];
  public activeAddress: Address;

  constructor(private _clientService: ClientService, private _addressService: AddressService,
              private _route: ActivatedRoute, private _router: Router, private _toastr: ToastsManager,
              private vcr: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.client = this._route.snapshot.data['client'];
    this.addresses = this._route.snapshot.data['addresses'];
    console.log(this.client);
  }

  markAsActive(activeRow: Address): void {
    if (this.activeAddress === activeRow) {
      this.activeAddress = null;
    } else {
      this.activeAddress = activeRow;
    }
  }

  onAddAddress(): boolean {
    this._router.navigate(['/clients', this.client.id, 'newAddress']);
    return true;
  }

  onEditAddresses(): boolean {
    if (!this.activeAddress) {
      return this.cannotProceed('Please select an address');
    } else {
      this._router.navigate(['/clients', this.client.id, 'address', this.activeAddress.id]);
      return true;
    }
  }

  onSetAsMainAddress(): boolean {
    if (!this.activeAddress) {
      return this.cannotProceed('Please select an address');
    } else if (this.activeAddress.id === this.client.mainAddress.id) {
      return this.cannotProceed('This address is already main address');
    } else {
      this._addressService.setAsMainAddress(this.activeAddress.id, this.client.id).subscribe(
        response => {
          this._toastr.success(response, 'Success!');
          this.client.mainAddress = this.activeAddress;
          this.activeAddress = null;
        },
        error => this._toastr.error(error, 'Error!'));
    }
  }

  onRemoveAddress(): boolean {
    if (!this.activeAddress) {
      return this.cannotProceed('Please select an address');
    } else if (this.client.mainAddress.id === this.activeAddress.id) {
      return this.cannotProceed('You can\'t delete address that is currently a main address.', 'medium');
    } else if (this.addresses.length <= LAST_AVAILABLE_ADDRESS) {
      return this.cannotProceed('You can\'t delete last address or address that is currently ' +
        'set as main client\'s address', 'medium');
    } else {
      this.removeConfirm();
    }
  }

  private removeConfirm(): void {
    bootbox.confirm({
      title: 'Address deletion',
      message: 'Do you want to remove selected address?',
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
          this._addressService.deleteAddress(this.activeAddress.id, this.client.id).subscribe(
            response => {
              this._toastr.success(response, 'Success!');
              this.addresses = this.addresses.filter((element) => element !== this.activeAddress);
              this.activeAddress = null;
              this._router.navigate(['/clients/details', this.client.id]);
            }, error => this._toastr.error(error, 'Error!'));
          return true;
        } else {
          return;
        }
      }
    });
  }

  private cannotProceed(message: string, size: string = 'small'): boolean {
    bootbox.alert({
      message: message,
      size: size,
      backdrop: true
    });
    return false;
  }

  onBack(): void {
    this._router.navigate(['/clients']);
  }
}
