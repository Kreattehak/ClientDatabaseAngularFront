import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../shared/validation.service';
import {AuthenticationService} from './authentication.service';
import {ToastsManager} from 'ng2-toastr';

declare const bootbox: any;

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userForm: FormGroup;
  public formErrors = {
    'username': '',
    'password': '',
  };

  constructor(private _router: Router, private _authenticationService: AuthenticationService,
              private _validationService: ValidationService, private _toastr: ToastsManager,
              private vcr: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this._authenticationService.logout();

    const username = new FormControl('', [Validators.required, Validators.minLength(3)]);
    const password = new FormControl('', [Validators.required]);

    this.userForm = new FormGroup({
      username: username,
      password: password
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  login(): void {
    this._authenticationService.login(this.userForm.value.username, this.userForm.value.password)
      .subscribe(response => {
        if (response === true) {
          // login successful
          this._router.navigate(['/clients']);
        } else {
          this.loginFailed();
        }
      }, error => {
        this.loginFailed();
      });
  }

  private loginFailed(): void {
    bootbox.alert({
      message: 'Username or password is incorrect',
      size: 'medium',
      backdrop: true
    });
  }

  private onValueChanged(data ?: any) {
    if (!this.userForm) {
      return;
    }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.checkField(field);
      }
    }
  }

  private checkField(field: any) {
    const form = this.userForm;
    this.formErrors[field] = '';
    const control = form.get(field);

    if (control && control.dirty && !control.valid) {
      const messages = this._validationService.getLocalizedValidationMessages(field);
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
