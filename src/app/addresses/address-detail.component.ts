import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Address} from './address';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {AddressService} from './address.service';
import {Client} from '../clients/client';
import {ClientService} from '../clients/client.service';
import {Validation} from '../shared/validation';

@Component({
  templateUrl: './address-detail.component.html',
})
export class AddressDetailComponent implements OnInit {

  public activeAddress: Address;
  public activeClient: Client;
  private clientId: number;
  public isNewAddress: boolean;

  public addressForm: FormGroup;
  public submitted: boolean;

  public formErrors = {
    'cityName': '',
    'streetName': '',
    'zipCode': ''
  };

  constructor(private _addressService: AddressService, private _clientService: ClientService,
              private _route: ActivatedRoute, private _router: Router, private _toastr: ToastsManager,
              private vcr: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.clientId = +this._route.snapshot.paramMap.get('id');
    if (!this._route.snapshot.data['addresses']) {
      this.activeAddress = new Address();
      this.isNewAddress = true;
    } else {
      const data = this._route.snapshot.data['addresses'];
      const addressId = +this._route.snapshot.paramMap.get('addressId');
      this.activeAddress = data.find((element) => element.id === addressId);
      this.isNewAddress = false;
    }
    this.activeClient = this._route.snapshot.data['client'];

    const id = new FormControl('');
    const streetName = new FormControl(this.activeAddress.streetName,
      [Validators.required, Validators.minLength(3)]);
    const cityName = new FormControl(this.activeAddress.cityName,
      [Validators.required, Validators.minLength(3)]);
    const zipCode = new FormControl(this.activeAddress.zipCode,
      [Validators.required, Validators.minLength(6),
      Validators.maxLength(6), Validators.pattern(/\d{2}-\d{3}/ig)]);

    this.addressForm = new FormGroup({
      id: id,
      streetName: streetName,
      cityName: cityName,
      zipCode: zipCode
    });

    this.addressForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onSubmit(id: number): void {
    if (this.activeAddress === this.addressForm.value) {
      this._toastr.error('Client already exists', 'Error!');
      return;
    }

    this.submitted = true;
    this.activeAddress = this.addressForm.value;

    if (this.isNewAddress) {
      this._addressService.saveNewAddress(this.activeAddress, this.clientId).subscribe(
        response => this._toastr.success('Address was successfully added.', 'Success!'),
            error => this._toastr.error('Address wasn\'t added.', 'Error!')
        );
    } else {
      this.activeAddress.id = id;
      this._addressService.updateAddress(this.activeAddress).subscribe(
        response => this._toastr.success(response, 'Success!'),
        error => this._toastr.error(error, 'Error!'));
    }
  }

  private onBack(): void {
    this._router.navigate(['/clients', this.clientId, 'details']);
  }

  private onValueChanged(data ?: any) {
    if (!this.addressForm) {
      return;
    }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.checkField(field);
      }
    }
  }

  private checkField(field: any) {
    const form = this.addressForm;
    this.formErrors[field] = '';
    const control = form.get(field);

    if (control && control.dirty && !control.valid) {
      const messages = Validation.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
