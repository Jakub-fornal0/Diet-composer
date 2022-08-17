import { RecipeDetail } from './../../../interfaces/recipe.model';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageConsts } from '../../../consts/localstorage-consts';
import {
  RecipeStepConsts,
  RecipeToScheduleConst,
} from '../../../consts/recipe-step-consts';
import { Product } from '../../../interfaces/product.model';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipeToScheduleComponent } from '../add-recipe-to-schedule/add-recipe-to-schedule.component';
import { MealData } from '../../../interfaces/schedule.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  products: Product[] = [];
  recipeStep: string[] = [];
  recipeToSchedule: MealData = RecipeToScheduleConst;

  // _________________________MOCKUP _________________________//
  recipe: RecipeDetail = {
    id: 1,
    image: 'assets/zdj.jpg',
    name: 'Zapiekanka makaronowa',
    category: 'obiad',
    cookingTime: '45 min',
    portions: 4,
    products: [
      { id: 6, name: 'makaron pióra', quantity: 200, measureUnit: 'g' },
      { id: 5, name: 'pierś z kurczaka', quantity: 0.2, measureUnit: 'kg' },
      { id: 12, name: 'cebula', quantity: 1, measureUnit: 'szt' },
      { id: 13, name: 'przecier pomidorowy', quantity: 150, measureUnit: 'ml' },
      { id: 7, name: 'pomidor', quantity: 150, measureUnit: 'g' },
      { id: 15, name: 'ser zółty', quantity: 300, measureUnit: 'g' },
      { id: 10, name: 'olej rzepakowy', quantity: 0.25, measureUnit: 'l' },
      { id: 18, name: 'woda', quantity: 250, measureUnit: 'ml' },
    ],
    recipe: [
      'Cebulę pokrój w piórka, czosnek przeciśnij przez praskę.',
      'Podsmaż je na oleju.',
      'Ugotuj makaron na sposób al dente.',
      'Warzywa pokrój w paski i wraz z kurczakiem dodaj do całości. Duś około 15 minut.',
      'Następnie podlej szklanką wody i dodaj kostkę Rosołu z kury Knorr oraz przecier pomidorowy.',
      'Makaron wyłóż do naczynia żaroodpornego, zalej sosem i posyp startym serem.',
      'Włóż do piekarnika nagrzanego do 180 stopni na 20 minut. Następnie podawaj.',
    ],
    author: 'Pędzimąż Andrzej',
    calories: 500,
    fats: 123,
    proteins: 123,
    carbohydrates: 123,
  };
  // _________________________________________________//

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const dataFromLocalStorage =
      this.localStorageService.getItemFromLocalStorage<Product[]>(
        LocalStorageConsts.PRODUCTS
      );
    if (dataFromLocalStorage) {
      this.products = dataFromLocalStorage;
    }

    this.recipe.recipe.forEach(() =>
      this.recipeStep.push(RecipeStepConsts.TODO)
    );
    this.recipeStep[0] = RecipeStepConsts.DOING;

    this.recipeToSchedule.recipeId = this.recipe.id;
    this.recipeToSchedule.recipeName = this.recipe.name;
    this.recipeToSchedule.recipeImage = this.recipe.image;
    this.recipeToSchedule.calories = this.recipe.calories;
    this.recipeToSchedule.fats = this.recipe.fats;
    this.recipeToSchedule.carbohydrates = this.recipe.carbohydrates;
    this.recipeToSchedule.proteins = this.recipe.portions;
  }

  checkUserHaveProduct(recipeProduct: Product): boolean {
    const foundProduct = this.products.find(
      (userProduct) => userProduct.id === recipeProduct.id
    );

    if (
      foundProduct?.quantity &&
      recipeProduct.quantity &&
      foundProduct.quantity >= recipeProduct.quantity
    ) {
      return true;
    }
    return false;
  }

  checkDisabled(i: number): boolean {
    if (this.recipeStep[i + 1] === RecipeStepConsts.DONE) {
      return true;
    }

    if (i === 0 || this.recipeStep[i - 1] === RecipeStepConsts.DONE) {
      return false;
    }

    return true;
  }

  makeStepAsDone(i: number) {
    const doingIndex = this.recipeStep.indexOf(RecipeStepConsts.DOING);
    const doingIndexDifferenceI: number = doingIndex - i;
    let indexSmallerThanDoingIndex: boolean = false;

    if (doingIndexDifferenceI === 1) {
      indexSmallerThanDoingIndex = true;
      this.recipeStep[i + 1] = RecipeStepConsts.TODO;
      this.recipeStep[i] = RecipeStepConsts.DOING;
    }

    if (
      !indexSmallerThanDoingIndex &&
      this.recipeStep[i] === RecipeStepConsts.DOING
    ) {
      this.recipeStep[i] = RecipeStepConsts.DONE;
      this.recipeStep[i + 1] = RecipeStepConsts.DOING;
    }
  }

  openAddtoScheduleDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AddRecipeToScheduleComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.recipeToSchedule,
    });
  }
}
