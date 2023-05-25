import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './materialUI/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductsComponent } from './components/products/products.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { RecipesFilterDialogComponent } from './components/recipes/recipes-filter-dialog/recipes-filter-dialog.component';
import { RecipeDetailComponent } from './components/recipes/recipe-detail/recipe-detail.component';
import { RecipeCardComponent } from './components/recipes/recipe-card/recipe-card.component';
import { AddRecipeToScheduleComponent } from './components/recipes/add-recipe-to-schedule/add-recipe-to-schedule.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { SetBodyParametersDialogComponent } from './components/account-settings/set-body-parameters-dialog/set-body-parameters-dialog.component';
import { AddNewRecipeComponent } from './components/recipes/add-new-recipe/add-new-recipe.component';
import { AddProductToRecipeComponent } from './components/recipes/add-new-recipe/add-product-to-recipe/add-product-to-recipe.component';
import { AddAnotherStepToRecipeComponent } from './components/recipes/add-new-recipe/add-another-step-to-recipe/add-another-step-to-recipe.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthInterceptor } from './services/auth-token-interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SetUserImageDialogComponent } from './components/account-settings/set-user-image-dialog/set-user-image-dialog.component';
import { AddOtherMealToScheduleComponent } from './components/schedule/add-other-meal-to-schedule/add-other-meal-to-schedule.component';
import { DeleteRecipeDialogComponent } from './components/account-settings/delete-recipe-dialog/delete-recipe-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { DeleteAllProductsDialogComponent } from './components/products/delete-all-products-dialog/delete-all-products-dialog.component';
import { DeleteMealDialogComponent } from './components/schedule/delete-meal-dialog/delete-meal-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SigninComponent,
    SignupComponent,
    ProductsComponent,
    RecipesComponent,
    RecipesFilterDialogComponent,
    RecipeDetailComponent,
    RecipeCardComponent,
    AddRecipeToScheduleComponent,
    ScheduleComponent,
    AccountSettingsComponent,
    SetBodyParametersDialogComponent,
    AddNewRecipeComponent,
    AddProductToRecipeComponent,
    AddAnotherStepToRecipeComponent,
    NotFoundComponent,
    SetUserImageDialogComponent,
    AddOtherMealToScheduleComponent,
    DeleteRecipeDialogComponent,
    HomeComponent,
    DeleteAllProductsDialogComponent,
    DeleteMealDialogComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
