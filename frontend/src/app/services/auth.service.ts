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
  public userProfile = new BehaviorSubject<UserProfile | null>(null);
  public jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  public userRegister(registerData: registerData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/signup`, registerData);
  }

  public login(loginData: loginData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/signin`, loginData).pipe(
      map((data) => {
        let token = { token: data.token } as Token;
        localStorage.setItem(LocalStorageConsts.TOKEN, JSON.stringify(token));
        let userInfo = this.jwtService.decodeToken(token.token) as UserProfile;
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

  public getAccessToken(): string {
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

  public userIsAuth(): boolean {
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

  public getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
}
