import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './login/authentication.service';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isAboutAuthorDisplayed = false;
  public userName: string;

  constructor(private _router: Router, private _authenticationService: AuthenticationService,
              private _toastr: ToastsManager, private vcr: ViewContainerRef) {
    this._toastr.setRootViewContainerRef(vcr);
  }

  showAboutAuthor(): void {
    if (!this.isAboutAuthorDisplayed) {
      this._router.navigate([{outlets: {messages: ['aboutAuthor']}}]);
      this.isAboutAuthorDisplayed = !this.isAboutAuthorDisplayed;
    } else {
      this._router.navigate([{outlets: {messages: null}}]);
      this.isAboutAuthorDisplayed = !this.isAboutAuthorDisplayed;
    }
  }

  ngOnInit(): void {
    this.userName = this._authenticationService.getUserName();
  }
}
