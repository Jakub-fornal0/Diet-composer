import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedule } from '../../../interfaces/schedule.model';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageConsts } from '../../../consts/localstorage-consts';
import { FormControl } from '@angular/forms';
import { ScheduleConsts } from '../../../consts/schedule-consts';
import { RecipeDetail } from '../../../interfaces/recipe.model';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.model';

@Component({
  selector: 'app-add-recipe-to-schedule',
  templateUrl: './add-recipe-to-schedule.component.html',
  styleUrls: ['./add-recipe-to-schedule.component.scss'],
})
export class AddRecipeToScheduleComponent implements OnInit {
  public typeOfMeal = new FormControl('');
  public mealTime = new FormControl();
  public recipe?: RecipeDetail;
  public schedule: Schedule = ScheduleConsts;
  public typeOfMealIsChosen: boolean = false;
  private userWantUpdateProduct: boolean = false;
  private userProducts: Product[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddRecipeToScheduleComponent>,
    private localStorageService: LocalStorageService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDetail
  ) {
    this.recipe = data;
  }

  ngOnInit(): void {
    const dataFromLocalStorage =
      this.localStorageService.getItemFromLocalStorage<Schedule>(
        LocalStorageConsts.SCHEDULE
      );
    if (dataFromLocalStorage) {
      this.schedule = dataFromLocalStorage;
    }

    this.typeOfMeal.valueChanges.subscribe(() => {
      this.typeOfMealIsChosen = false;
      const type = this.typeOfMeal.value;
      if (
        (type === 'breakfast' ||
          type === 'secondBreakfast' ||
          type === 'lunch' ||
          type === 'tea' ||
          type === 'dinner') &&
        this.schedule[type].recipeId
      ) {
        this.typeOfMealIsChosen = true;
      }
    });
  }

  public checkValidations(): boolean {
    if (this.typeOfMeal.value && this.mealTime.value) {
      return true;
    }
    return false;
  }

  public saveMealToSchedule(): void {
    const type = this.typeOfMeal.value;
    if (
      (type === 'breakfast' ||
        type === 'secondBreakfast' ||
        type === 'lunch' ||
        type === 'tea' ||
        type === 'dinner') &&
      this.recipe
    ) {
      this.schedule[type].recipeId = this.recipe.id;
      this.schedule[type].recipeName = this.recipe.name;
      this.schedule[type].recipeImage = this.recipe.image;
      this.schedule[type].calories = this.recipe.calories;
      this.schedule[type].fats = this.recipe.fats;
      this.schedule[type].proteins = this.recipe.proteins;
      this.schedule[type].carbohydrates = this.recipe.carbohydrates;
      this.schedule[type].time = this.mealTime.value;
    }

    if (this.userWantUpdateProduct) {
      this.getUserProducts();
      setTimeout(() => {
        this.updateUserProduct();
      }, 100);
    }

    this.localStorageService.setItemToLocalStorage(
      LocalStorageConsts.SCHEDULE,
      this.schedule
    );

    this.dialogRef.close(this.userProducts);
  }

  public setUpdateUserProducts(): void {
    this.userWantUpdateProduct = !this.userWantUpdateProduct;
  }

  private getUserProducts() {
    this.productService.getAllUserProducts().subscribe((res) => {
      res.Products.forEach((product: any) => {
        this.userProducts.push({
          id: product.product.id,
          name: product.product.name,
          measureUnit: product.product.measureUnit,
          quantity: product.quantity,
        });
      });
    });
  }

  private updateUserProduct(): void {
    this.userProducts.forEach((product) => {
      let productFromRecipe: Product | undefined;
      if (this.recipe) {
        productFromRecipe = this.recipe.products.find(
          (productRecipe) => productRecipe.id === product.id
        );
      }

      if (
        productFromRecipe &&
        product.id &&
        productFromRecipe.quantity &&
        product.quantity
      ) {
        product.quantity -= productFromRecipe.quantity;
        this.deleteProduct(product.id);

        if (product.quantity > 0) {
          this.addProduct(product);
        }
      }
    });
  }

  private addProduct(product: Product): void {
    this.productService.addUserProduct(product).subscribe(() => {
      this.userProducts.push(product);
    });
  }

  private deleteProduct(index: number): void {
    this.productService.deleteUserProduct(index).subscribe(() => {
      this.userProducts.splice(index, 1);
    });
  }
}
