import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiURL = environment.apiURL;
  private token = this.authService.getAccessToken();
  private httpOptions = {
    headers: new HttpHeaders({
      'x-access-token': this.token,
    }),
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  public calculateUserDemands(userParameters: {
    id: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
    dietType: string;
    physicalActivity: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiURL}/user/BodyMassIndex`,
      userParameters,
      this.httpOptions
    );
  }

  public getUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/user/All`, this.httpOptions);
  }

  public setUserImage(image: File): Observable<any> {
    const uploadImageData = new FormData();
    uploadImageData.append('image', image);
    return this.http.post<any>(
      `${this.apiURL}/user/uploadImage`,
      uploadImageData,
      this.httpOptions
    );
  }
}
