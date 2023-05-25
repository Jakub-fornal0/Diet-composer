import { RecipeDetail, RecipeStep } from './../../../interfaces/recipe.model';
import { Component, OnInit } from '@angular/core';
import { RecipeStepConsts } from '../../../consts/recipe-step-consts';
import { Product } from '../../../interfaces/product.model';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipeToScheduleComponent } from '../add-recipe-to-schedule/add-recipe-to-schedule.component';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { RecipeDetailConsts } from '../../../consts/recipe-detail-consts';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  public products: Product[] = [];
  public recipeSteps: string[] = [];
  public recipe: RecipeDetail = RecipeDetailConsts;
  public authListenerSubs?: Subscription;
  public userIsAuthenticated: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkUserIsAuth();
    this.getRecipeData();

    if (this.userIsAuthenticated) {
      this.getUserProducts();
    }
  }

  private checkUserIsAuth(): void {
    this.userIsAuthenticated = this.authService.userIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.userIsAuthenticated = isAuth;
      });
  }

  private getRecipeData(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        const recipeId = paramMap.get('recipeId') || '';

        this.recipeService.getRecipeDetail(recipeId).subscribe({
          error: (err) => {
            if (err.status === 500) {
              this.router.navigate(['/not-found']);
            }
          },
          next: (res) => {
            let recipeSteps: RecipeStep[] = [];
            res.RecipeDetail.recipeSteps.forEach(
              (recipeStep: { step: number; name: string }) => {
                recipeSteps.push({
                  id: recipeStep.step,
                  name: recipeStep.name,
                });
              }
            );

            let products: Product[] = [];
            res.RecipeDetail.products.forEach(
              (product: {
                id: number;
                name: string;
                recipeProduct: { quantity: number };
                measureUnit: string;
              }) => {
                products.push({
                  id: product.id,
                  name: product.name,
                  quantity: product.recipeProduct.quantity,
                  measureUnit: product.measureUnit,
                });
              }
            );

            delete res.RecipeDetail['products'];
            delete res.RecipeDetail['recipeSteps'];
            this.recipe = res.RecipeDetail;
            this.recipe.recipeStep = recipeSteps;
            this.recipe.products = products;
            this.recipe.calories = parseFloat(
              (res.RecipeDetail.calories / res.RecipeDetail.portions).toFixed(2)
            );
            this.recipe.fats = parseFloat(
              (res.RecipeDetail.fats / res.RecipeDetail.portions).toFixed(2)
            );
            this.recipe.carbohydrates = parseFloat(
              (
                res.RecipeDetail.carbohydrates / res.RecipeDetail.portions
              ).toFixed(2)
            );
            this.recipe.proteins = parseFloat(
              (res.RecipeDetail.proteins / res.RecipeDetail.portions).toFixed(2)
            );

            this.recipe.recipeStep.forEach(() =>
              this.recipeSteps.push(RecipeStepConsts.TODO)
            );
            this.recipeSteps[0] = RecipeStepConsts.DOING;
          },
        });
      }
    });
  }

  private getUserProducts(): void {
    this.products = [];
    this.productService.getAllUserProducts().subscribe((res) => {
      res.Products.forEach((product: any) => {
        this.products.push({
          id: product.product.id,
          name: product.product.name,
          measureUnit: product.product.measureUnit,
          quantity: product.quantity,
        });
      });
    });
  }

  public checkUserHaveProduct(recipeProduct: Product): boolean {
    const foundProduct = this.products.find(
      (userProduct: Product) => userProduct.id === recipeProduct.id
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

  public checkDisabled(i: number): boolean {
    if (this.recipeSteps[i + 1] === RecipeStepConsts.DONE) {
      return true;
    }

    if (i === 0 || this.recipeSteps[i - 1] === RecipeStepConsts.DONE) {
      return false;
    }

    return true;
  }

  public makeStepAsDone(i: number): void {
    const doingIndex = this.recipeSteps.indexOf(RecipeStepConsts.DOING);
    const doingIndexDifferenceI: number = doingIndex - i;
    let indexSmallerThanDoingIndex: boolean = false;

    if (doingIndexDifferenceI === 1) {
      indexSmallerThanDoingIndex = true;
      this.recipeSteps[i + 1] = RecipeStepConsts.TODO;
      this.recipeSteps[i] = RecipeStepConsts.DOING;
    }

    if (
      !indexSmallerThanDoingIndex &&
      this.recipeSteps[i] === RecipeStepConsts.DOING
    ) {
      this.recipeSteps[i] = RecipeStepConsts.DONE;
      this.recipeSteps[i + 1] = RecipeStepConsts.DOING;
    }
  }

  public openAddtoScheduleDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog
      .open(AddRecipeToScheduleComponent, {
        width: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.recipe,
      })
      .afterClosed()
      .subscribe(
        (data: { product: Product[]; correctAddedRecipe: boolean }) => {
          if (data.correctAddedRecipe && data) {
            this.snackBar.open('Dodano do harmonogramu.', '', {
              duration: 2000,
            });

            if (data.product.length) {
              this.products = data.product;
            }
          } else if (data) {
            this.snackBar.open(
              'Coś poszło nie tak! Nie dodano przepisu...',
              '',
              {
                duration: 2000,
              }
            );
          }
        }
      );
  }
}
