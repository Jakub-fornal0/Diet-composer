import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecipeAddData } from '../interfaces/recipe.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiURL = environment.apiURL;
  private token = this.authService.getAccessToken();
  private httpOptions = {
    headers: new HttpHeaders({
      'x-access-token': this.token,
    }),
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  addRecipe(recipeAddData: any): Observable<any> {
    console.log(recipeAddData);
    return this.http.post<any>(
      `${this.apiURL}/recipes`,
      recipeAddData,
      this.httpOptions
    );
  }
}
