import { SessionStorageService } from './session-storage.service';
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    this.sessionStorageService.clearSessionStorage();
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
