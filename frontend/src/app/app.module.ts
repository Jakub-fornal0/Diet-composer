import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    DragDropModule,
    MatExpansionModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatStepperModule,
    MatSliderModule,
    MatChipsModule,
    MatRadioModule,
    MatSidenavModule,
    MatSnackBarModule,
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
