import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../materialUI/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipesComponent } from './recipes.component';
import { RecipesFilterDialogComponent } from './recipes-filter-dialog/recipes-filter-dialog.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { AddRecipeToScheduleComponent } from './add-recipe-to-schedule/add-recipe-to-schedule.component';
import { AddNewRecipeComponent } from './add-new-recipe/add-new-recipe.component';
import { AddProductToRecipeComponent } from './add-new-recipe/add-product-to-recipe/add-product-to-recipe.component';
import { AddAnotherStepToRecipeComponent } from './add-new-recipe/add-another-step-to-recipe/add-another-step-to-recipe.component';
import { RouterModule } from '@angular/router';

@NgModule({
  entryComponents: [RecipesComponent],
  declarations: [
    RecipesComponent,
    RecipesFilterDialogComponent,
    RecipeDetailComponent,
    RecipeCardComponent,
    AddRecipeToScheduleComponent,
    AddNewRecipeComponent,
    AddProductToRecipeComponent,
    AddAnotherStepToRecipeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [RecipesComponent],
})
export class RecipesModule {}
