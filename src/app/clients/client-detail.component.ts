import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {AddressService} from '../addresses/address.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from './client';
import {Address} from '../addresses/address';
import {ToastsManager} from 'ng2-toastr';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';

declare var bootbox: any;

@Component({
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent implements OnInit {

  public client: Client;
  public addresses: Address[];
  public activeAddress: Address;

  constructor(private _addressService: AddressService, private _route: ActivatedRoute,
              private _validationService: ValidationAndLocaleMessagesService,
              private _router: Router, private _toastr: ToastsManager, private vcr: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.client = this._route.snapshot.data['client'];
    this.addresses = this._route.snapshot.data['addresses'];
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
      return this.cannotProceed(this._validationService.getLocalizedMessages('rowNotSelected'));
    } else {
      this._router.navigate(['/clients', this.client.id, 'address', this.activeAddress.id]);
      return true;
    }
  }

  onSetAsMainAddress(): boolean {
    if (!this.activeAddress) {
      return this.cannotProceed(this._validationService.getLocalizedMessages('rowNotSelected'));
    } else if (this.activeAddress.id === this.client.mainAddress.id) {
      return this.cannotProceed(this._validationService.getLocalizedMessages('alreadyMainAddress'));
    } else {
      this._addressService.setAsMainAddress(this.activeAddress.id, this.client.id).subscribe(
        response => {
          this._toastr.success(response, this._validationService.getLocalizedMessages('successTitle'));
          this.client.mainAddress = this.activeAddress;
          this.activeAddress = null;
        },
        error => this._toastr.error(error, this._validationService.getLocalizedMessages('errorTitle')));
    }
  }

  onRemoveAddress(): boolean {
    if (!this.activeAddress) {
      return this.cannotProceed(this._validationService.getLocalizedMessages('rowNotSelected'));
    } else if (this.client.mainAddress.id === this.activeAddress.id) {
      return this.cannotProceed(this._validationService.getLocalizedMessages('cannotDeleteMainAddress'),
        'medium');
    } else {
      this.removeConfirm();
    }
  }

  private removeConfirm(): void {
    bootbox.confirm({
      title: this._validationService.getLocalizedMessages('removeAddressConfirmTitle'),
      message: this._validationService.getLocalizedMessages('removeAddressConfirmMessage'),
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> ' + this._validationService.getLocalizedMessages('cancelAction')
        },
        confirm: {
          label: '<i class="fa fa-check"></i> ' + this._validationService.getLocalizedMessages('confirmAction')
        }
      },
      callback: (result) => {
        if (result) {
          this._addressService.deleteAddress(this.activeAddress.id, this.client.id).subscribe(
            response => {
              this._toastr.success(response, this._validationService.getLocalizedMessages('successTitle'));
              this.addresses = this.addresses.filter((element) => element !== this.activeAddress);
              this.activeAddress = null;
              this._router.navigate(['/clients', this.client.id, 'details']);
            }, error => this._toastr.error(error, this._validationService.getLocalizedMessages('errorTitle')));
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
