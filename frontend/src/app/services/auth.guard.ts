import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.authService.userIsAuth()) {
      if (route.data['requiredAuth'] == false) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } else {
      if (route.data['requiredAuth'] == true) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
  }
}
