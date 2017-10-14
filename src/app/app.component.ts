import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './login/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private isAboutAuthorDisplayed: boolean;
  private userName: string;

  constructor(private _router: Router, public _authenticationService: AuthenticationService) { }

  private showAboutAuthor(): void {
    if (!this.isAboutAuthorDisplayed) {
      this._router.navigate([{ outlets: { messages: ['aboutUs'] } }]);
      this.isAboutAuthorDisplayed = !this.isAboutAuthorDisplayed;
    } else {
      this._router.navigate([{ outlets: { messages: null } }]);
      this.isAboutAuthorDisplayed = !this.isAboutAuthorDisplayed;
    }
  }

  ngOnInit(): void {
    this.userName = this._authenticationService.getUserName();
  }
}
