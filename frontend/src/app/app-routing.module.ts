import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { RecipeDetailComponent } from './components/recipes/recipe-detail/recipe-detail.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: 'login', component: SigninComponent },
  { path: 'login/register', component: SignupComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'recipes', component: RecipesComponent, children: [] },
  { path: 'recipes/detail/:recipeId', component: RecipeDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
