import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageConsts } from '../consts/localstorage-consts';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authorizationToken = localStorage.getItem(LocalStorageConsts.TOKEN);
    const authorizationRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authorizationToken),
    });
    return next.handle(authorizationRequest);
  }
}
