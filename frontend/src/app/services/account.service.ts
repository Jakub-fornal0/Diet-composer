import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  calculateUserDemands(userParameters: {
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
      userParameters
    );
  }

  getUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/user/All`);
  }

  setUserImage(image: File, id: string): Observable<any> {
    const uploadImageData = new FormData();
    uploadImageData.append('image', image);
    uploadImageData.append('id', id);
    return this.http.post<any>(
      `${this.apiURL}/user/uploadImage`,
      uploadImageData
    );
  }
}
