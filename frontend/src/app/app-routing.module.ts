import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductsComponent } from './layouts/products/products.component';
import { AddNewRecipeComponent } from './components/recipes/add-new-recipe/add-new-recipe.component';
import { RecipeDetailComponent } from './components/recipes/recipe-detail/recipe-detail.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: SigninComponent,
    data: { requiredAuth: false },
    canActivate: [AuthGuard],
  },
  {
    path: 'login/register',
    component: SignupComponent,
    data: { requiredAuth: false },
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { requiredAuth: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'recipes',
    component: RecipesComponent,
  },
  {
    path: 'recipes/detail/:recipeId',
    component: RecipeDetailComponent,
  },
  {
    path: 'recipes/add',
    component: AddNewRecipeComponent,
    data: { requiredAuth: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'recipes/edit/:recipeId',
    component: AddNewRecipeComponent,
    data: { requiredAuth: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    data: { requiredAuth: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'account/settings',
    component: AccountSettingsComponent,
    data: { requiredAuth: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  { path: '**', pathMatch: 'full', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
