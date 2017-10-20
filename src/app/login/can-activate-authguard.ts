import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      if (!this.authService.isTokenExpired()) {
        return true;
      }
      this.router.navigate(['/login', {expired: 'true'}]);
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
