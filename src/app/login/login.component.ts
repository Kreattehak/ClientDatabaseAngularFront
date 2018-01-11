import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidationAndLocaleMessagesService} from '../shared/validation-and-locale-messages.service';
import {AuthenticationService} from './authentication.service';
import {ToastsManager} from 'ng2-toastr';
import {Subject} from 'rxjs/Subject';
import {BOOTBOX_TOKEN} from '../utils/bootbox';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  public userForm: FormGroup;
  public formErrors = {
    'username': '',
    'password': '',
  };
  public errorMessage: string;
  public logoutMessage: string;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _router: Router, private _authenticationService: AuthenticationService,
              private _validationService: ValidationAndLocaleMessagesService,
              private _toastr: ToastsManager, private _route: ActivatedRoute,
              @Inject(BOOTBOX_TOKEN) private bootbox: any) {
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

    this.userForm.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => this._validationService.onValueChanged(
        this.userForm, this.formErrors, data));

    this._validationService.onValueChanged(this.userForm, this.formErrors);
  }

  login(): void {
    this._authenticationService.login(this.userForm.value.username, this.userForm.value.password)
      .takeUntil(this.ngUnsubscribe)
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loginFailed(message: Response): void {
    this.bootbox.alert({
      message: message,
      size: 'medium',
      backdrop: true
    });
  }
}
