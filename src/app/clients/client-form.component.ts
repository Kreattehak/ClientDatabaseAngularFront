import {Component, OnInit} from '@angular/core';
import {Client} from './client';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientService} from './client.service';
import {ToastsManager} from 'ng2-toastr';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';

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

  constructor(private _clientService: ClientService, private _toastr: ToastsManager,
              private _validationService: ValidationAndLocaleMessagesService,
              private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    this.getFormData();

    this.setUpForm();

    this.clientForm.valueChanges.subscribe(
      data => this._validationService.onValueChanged(this.clientForm, this.formErrors, data));

    // (re)set validation messages now
    this._validationService.onValueChanged(this.clientForm, this.formErrors);
  }

  onSubmit(id: number): void {
    this.submitted = true;

    if (this.isNewClient) {
      this.tryToSaveNewClient();
    } else {
      if (this.checkForClientDataDuplication()) {
        return;
      } else {
        this.tryToUpdateClient(id);
      }
    }
  }

  onBack(): void {
    this._router.navigate(['/clients']);
  }

  private tryToSaveNewClient(): void {
    this.activeClient = this.clientForm.value;
    this._clientService.saveNewClient(this.activeClient).subscribe(
      response => {
        if (this.shouldRedirectToAddressForm) {
          this._router.navigate(['/clients', response, 'newAddress']);
        } else {
          this._toastr.success(this._validationService.getLocalizedMessages('clientAdded'),
            this._validationService.getLocalizedMessages('successTitle')).then(
            () => this.onBack());
        }
      }, error => {
        if (error === -1) {
          this._toastr.error(this._validationService.getLocalizedMessages('clientNotAdded'),
            this._validationService.getLocalizedMessages('errorTitle'));
        } else {
          this._toastr.error(error, this._validationService.getLocalizedMessages('errorTitle'));
        }
      }
    );
  }

  private tryToUpdateClient(id: number): void {
    this.activeClient = this.clientForm.value;
    this.activeClient.id = id;
    this._clientService.updateClient(this.activeClient).subscribe(
      response => this._toastr.success(response,
        this._validationService.getLocalizedMessages('successTitle')).then(
        () => this.onBack()),
      error => this._toastr.error(error,
        this._validationService.getLocalizedMessages('errorTitle')));
  }

  private checkForClientDataDuplication(): boolean {
    if (this.activeClient.lastName === this.clientForm.value.lastName
      && this.activeClient.firstName === this.clientForm.value.firstName) {
      this._toastr.error(this._validationService.getLocalizedMessages('clientExists'),
        this._validationService.getLocalizedMessages('errorTitle'));
      this.submitted = false;
      return true;
    }
    return false;
  }

  private getFormData(): void {
    if (!this._route.snapshot.data['client']) {
      this.activeClient = new Client();
      this.isNewClient = true;
    } else {
      this.activeClient = this._route.snapshot.data['client'];
      this.isNewClient = false;
    }
  }

  private setUpForm(): void {
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
  }
}


