import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Client} from './client';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientService} from './client.service';
import {ToastsManager} from 'ng2-toastr';
import {ValidationService} from '../shared/validation.service';

@Component({
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent implements OnInit {

  public activeClient: Client;
  public isNewClient: boolean;
  public shouldRedirectToAddressForm: boolean;

  public clientForm: FormGroup;
  public submitted: boolean;

  public formErrors = {
    'firstName': '',
    'lastName': ''
  };

  constructor(private _clientService: ClientService, private _validationService: ValidationService,
              private _route: ActivatedRoute, private _router: Router, private _toastr: ToastsManager, private vcr: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    if (!this._route.snapshot.data['client']) {
      this.activeClient = new Client();
      this.isNewClient = true;
    } else {
      this.activeClient = this._route.snapshot.data['client'];
      this.isNewClient = false;
    }

    const id = new FormControl();
    const firstName = new FormControl(this.activeClient.firstName,
      [Validators.required, Validators.minLength(3)]);
    const lastName = new FormControl(this.activeClient.lastName,
      [Validators.required, Validators.minLength(3)]);

    this.clientForm = new FormGroup({
      id: id,
      firstName: firstName,
      lastName: lastName
    });

    this.clientForm.valueChanges.subscribe(data => this._validationService.onValueChanged(this.clientForm, this.formErrors, data));

    this._validationService.onValueChanged(this.clientForm, this.formErrors) // (re)set validation messages now
  }

  onSubmit(id: number): void {
    if (this.activeClient === this.clientForm.value) {
      this._toastr.error('Client already exists', 'Error!');
      return;
    }

    this.submitted = true;
    this.activeClient = this.clientForm.value;

    if (this.isNewClient) {
      console.log(this.activeClient);
      this._clientService.saveNewClient(this.activeClient).subscribe(
        response => {
          if (this.shouldRedirectToAddressForm) {
            this._router.navigate(['/clients', response, 'newAddress']);
          } else {
            this._toastr.success('Client was successfully added.', 'Success!');
          }
        }, error => this._toastr.error('Client wasn\'t added.', 'Error!'));
    } else {
      this.activeClient.id = id;
      console.log(this.activeClient);
      this._clientService.updateClient(this.activeClient).subscribe(
        response => this._toastr.success(response, 'Success!'),
        error => this._toastr.error(error, 'Error!'));
      // setTimeout(this._router.navigate(['/clients']), 10000);
    }

  }

  goBack(): void {
    this._router.navigate(['/clients']);
  }
}


