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

  addRecipe(recipeImage: File, recipeAddData: RecipeAddData): Observable<any> {
    const newRecipeData = new FormData();
    newRecipeData.append('image', recipeImage);
    newRecipeData.append('name', recipeAddData.name);
    newRecipeData.append('description', recipeAddData.description);
    newRecipeData.append('cookingTime', recipeAddData.cookingTime.toString());
    newRecipeData.append('portions', recipeAddData.portions.toString());
    newRecipeData.append('level', recipeAddData.level);
    newRecipeData.append('category', recipeAddData.category);
    newRecipeData.append('dietType', recipeAddData.dietType);
    newRecipeData.append('author', recipeAddData.author);
    newRecipeData.append('calories', recipeAddData.calories.toString());
    newRecipeData.append('fats', recipeAddData.fats.toString());
    newRecipeData.append('proteins', recipeAddData.proteins.toString());
    newRecipeData.append(
      'carbohydrates',
      recipeAddData.carbohydrates.toString()
    );
    newRecipeData.append('products', recipeAddData.products);
    newRecipeData.append('steps', recipeAddData.steps);

    return this.http.post<any>(
      `${this.apiURL}/recipes`,
      newRecipeData,
      this.httpOptions
    );
  }
}
