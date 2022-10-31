import { loginData } from './../interfaces/login.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { registerData } from '../interfaces/register.model';
import { UserProfile } from '../interfaces/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageConsts } from '../consts/localstorage-consts';
import { Token } from '../interfaces/token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = environment.apiURL;
  private authStatusListener = new Subject<boolean>();
  userProfile = new BehaviorSubject<UserProfile | null>(null);
  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  userRegister(registerData: registerData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/signup`, registerData);
  }

  login(loginData: loginData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/sigin`, loginData).pipe(
      map((data) => {
        var token = { token: data.token } as Token;
        localStorage.setItem(LocalStorageConsts.TOKEN, JSON.stringify(token));
        var userInfo = this.jwtService.decodeToken(token.token) as UserProfile;
        this.userProfile.next(userInfo);
        this.authStatusListener.next(true);
        return true;
      }),
      catchError((error) => {
        this.authStatusListener.next(false);
        return of(false);
      })
    );
  }

  getAccessToken(): string {
    const localStorageToken = localStorage.getItem(LocalStorageConsts.TOKEN);
    if (localStorageToken) {
      const token = JSON.parse(localStorageToken) as Token;
      const isTokenExpired = this.jwtService.isTokenExpired(token.token);
      if (isTokenExpired) {
        localStorage.removeItem(LocalStorageConsts.TOKEN);
        this.userProfile.next(null);
        return '';
      }
      const userInfo = this.jwtService.decodeToken(token.token) as UserProfile;
      this.userProfile.next(userInfo);
      return token.token;
    }
    return '';
  }

  userIsAuth(): boolean {
    this.getAccessToken();
    let userProfile = this.userProfile.getValue();
    if (!this.getAccessToken()) {
      this.authStatusListener.next(false);
      return false;
    }
    if (userProfile) {
      this.authStatusListener.next(true);
      return true;
    }
    this.authStatusListener.next(false);
    return false;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
}
