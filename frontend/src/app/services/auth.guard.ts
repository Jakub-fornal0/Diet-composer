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

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    this.sessionStorageService.clearSessionStorage();
    const requiredAuth = route.data['requiredAuth'];

    if (this.authService.userIsAuth()) {
      if (!requiredAuth) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } else {
      if (requiredAuth) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
  }
}
