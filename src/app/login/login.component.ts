import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
  public errorMessage: string;

  constructor(private _router: Router, private _authenticationService: AuthenticationService,
              private _validationService: ValidationService, private _toastr: ToastsManager,
              private vcr: ViewContainerRef, private _route: ActivatedRoute) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this._authenticationService.logout();

    if (this._route.snapshot.paramMap.get('expired')) {
      this.errorMessage = 'User token has expired!';
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
            this._router.navigate(['/clients']);
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
