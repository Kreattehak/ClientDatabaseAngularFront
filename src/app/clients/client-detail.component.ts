import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AddressService} from '../addresses/address.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from './client';
import {Address} from '../addresses/address';
import {ToastsManager} from 'ng2-toastr';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {Subject} from 'rxjs/Subject';
import {BOOTBOX_TOKEN} from '../utils/bootbox';

@Component({
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent implements OnInit, OnDestroy {

  public client: Client;
  public addresses: Address[];
  public activeAddress: Address;

  private ngUnsubscribe: Subject<string> = new Subject();

  constructor(private _addressService: AddressService, private _route: ActivatedRoute,
              private _validationService: ValidationAndLocaleMessagesService,
              private _router: Router, private _toastr: ToastsManager,
              @Inject(BOOTBOX_TOKEN) private bootbox: any) {
  }

  ngOnInit() {
    this.client = this._route.snapshot.data['client'];
    this.addresses = this._route.snapshot.data['addresses'];
  }

  markAsActive(activeRow: Address): void {
    this.activeAddress = this.activeAddress === activeRow ? null : activeRow;
  }

  onAddAddress(): boolean {
    this._router.navigate(['/clients', this.client.id, 'newAddress']);
    return true;
  }

  onEditAddress(): boolean {
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
      this.setAsMainAddress();
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

  onBack(): void {
    this._router.navigate(['/clients']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private setAsMainAddress(): void {
    this._addressService.setAsMainAddress(this.activeAddress.id, this.client.id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        response => {
          this.client.mainAddress = this.activeAddress;
          this.activeAddress = null;
          this._toastr.success(response, this._validationService.getLocalizedMessages('successTitle'));
        },
        error => this._toastr.error(error, this._validationService.getLocalizedMessages('errorTitle'))
      );
  }

  private removeConfirm(): void {
    this.bootbox.confirm({
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
      callback: this.removeAddress
    });
  }

  private removeAddress = (result) => {
    if (result) {
      this._addressService.deleteAddress(this.activeAddress.id, this.client.id)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          response => {
            this.addresses = this.addresses.filter((element) => element !== this.activeAddress);
            this.activeAddress = null;
            this._toastr.success(response, this._validationService.getLocalizedMessages('successTitle'));
          }, error => this._toastr.error(error, this._validationService.getLocalizedMessages('errorTitle'))
        );
      return true;
    } else {
      return;
    }
  };

  private cannotProceed(message: string, size: string = 'small'): boolean {
    this.bootbox.alert({
      message: message,
      size: size,
      backdrop: true
    });
    return false;
  }
}
