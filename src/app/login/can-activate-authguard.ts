import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      if (!this.authService.isTokenExpired()) {
        return true;
      }
      this.router.navigate(['/login', {expired: 'true'}]);
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
