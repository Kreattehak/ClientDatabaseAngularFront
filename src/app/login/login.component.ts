import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {AuthenticationService} from './authentication.service';
import {ToastsManager} from 'ng2-toastr';

declare const bootbox: any;

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public userForm: FormGroup;
  public formErrors = {
    'username': '',
    'password': '',
  };
  public errorMessage: string;
  public logoutMessage: string;

  constructor(private _router: Router, private _authenticationService: AuthenticationService,
              private _validationService: ValidationAndLocaleMessagesService,
              private _toastr: ToastsManager, private _route: ActivatedRoute) {
  }

  ngOnInit() {
    this._authenticationService.logout();

    if (this._route.snapshot.paramMap.get('logout')) {
      this.logoutMessage = this._validationService.getLocalizedMessages('userHasLogout');
    }
    if (this._route.snapshot.paramMap.get('expired')) {
      this.errorMessage = this._validationService.getLocalizedMessages('tokenHasExpired');
    }

    const username = new FormControl('', [Validators.required, Validators.minLength(3)]);
    const password = new FormControl('', [Validators.required]);

    this.userForm = new FormGroup({
      username: username,
      password: password
    });

    this.userForm.valueChanges.subscribe(data => this._validationService.onValueChanged(this.userForm, this.formErrors, data));

    this._validationService.onValueChanged(this.userForm, this.formErrors);
  }

  login(): void {
    this._authenticationService.login(this.userForm.value.username, this.userForm.value.password)
      .subscribe(response => {
          if (response === true) {
            // login successful
            this._toastr.success(this._validationService.getLocalizedMessages('loginSuccessful'),
              this._validationService.getLocalizedMessages('successTitle')).then(
              () => this._router.navigate(['/clients']));
          }
        },
        error => {
          this.loginFailed(error);
        });
  }

  private loginFailed(message: Response): void {
    bootbox.alert({
      message: message,
      size: 'medium',
      backdrop: true
    });
  }
}
