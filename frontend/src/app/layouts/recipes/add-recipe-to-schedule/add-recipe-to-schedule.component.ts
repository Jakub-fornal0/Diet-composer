import { ScheduleService } from './../../../services/schedule.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedule } from '../../../interfaces/schedule.model';
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
  private correctAddedRecipe: boolean = false;
  private mealTypes: { ang: string; pl: string }[] = [
    { ang: 'breakfast', pl: 'śniadanie' },
    { ang: 'secondBreakfast', pl: 'II śniadanie' },
    { ang: 'lunch', pl: 'obiad' },
    { ang: 'tea', pl: 'podwieczorek' },
    { ang: 'dinner', pl: 'kolacja' },
  ];

  constructor(
    private dialogRef: MatDialogRef<AddRecipeToScheduleComponent>,
    private productService: ProductService,
    private scheduleService: ScheduleService,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDetail
  ) {
    this.recipe = data;
  }

  ngOnInit(): void {
    this.getSchedule();

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

  private getSchedule(): void {
    this.scheduleService.getSchedule().subscribe((res) => {
      this.schedule = res;
    });
  }

  public checkValidations(): boolean {
    if (this.typeOfMeal.value && this.mealTime.value) {
      return true;
    }
    return false;
  }

  public saveMealToSchedule(): void {
    this.correctAddedRecipe = false;

    let processEnded: boolean = false;
    const type = this.mealTypes.find(
      (mealType) => mealType.ang === this.typeOfMeal.value
    );

    if (type && this.recipe && this.recipe.id) {
      this.scheduleService
        .addRecipeToSchedule(this.recipe.id, this.mealTime.value, type.pl)
        .subscribe((res) => {
          if (res.message === 'Dodano przepis do harmonogramu!') {
            this.correctAddedRecipe = true;
          }
          processEnded = true;

          if (this.userWantUpdateProduct) {
            this.getUserProducts();
            setTimeout(() => {
              this.updateUserProduct();
            }, 100);
          }

          if (processEnded) {
            this.dialogRef.close({
              product: this.userProducts,
              correctAddedRecipe: this.correctAddedRecipe,
            });
          }
        });
    }
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
