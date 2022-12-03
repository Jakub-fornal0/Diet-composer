import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SnackMealData } from '../interfaces/schedule.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiURL = environment.apiURL;
  private token = this.authService.getAccessToken();
  private httpOptions = {
    headers: new HttpHeaders({
      'x-access-token': this.token,
    }),
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  public addRecipeToSchedule(
    recipeId: string,
    time: string,
    type: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiURL}/schedule`,
      { recipeId: recipeId, time: time, type: type },
      this.httpOptions
    );
  }

  public removeRecipeFromSchedule(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiURL}/schedule/recipe/${id}`,
      this.httpOptions
    );
  }

  public getSchedule(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/schedule`, this.httpOptions);
  }

  public addSnack(snack: SnackMealData): Observable<any> {
    return this.http.post<any>(
      `${this.apiURL}/schedule/snack`,
      snack,
      this.httpOptions
    );
  }

  public removeSnack(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiURL}/schedule/snack/${id}`,
      this.httpOptions
    );
  }

  public clearSchedule(): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/schedule`, this.httpOptions);
  }

  public updateMealStatus(id: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiURL}/schedule/update/${id}`,
      id,
      this.httpOptions
    );
  }
}
