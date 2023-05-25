import { RecipeDetail } from './../../../interfaces/recipe.model';
import { AuthService } from './../../../services/auth.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RecipeAddData, RecipeStep } from '../../../interfaces/recipe.model';
import { Product } from '../../../interfaces/product.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { AccountService } from 'src/app/services/account.service';
import { UserProfile } from 'src/app/interfaces/user.model';

@Component({
  selector: 'app-add-new-recipe',
  templateUrl: './add-new-recipe.component.html',
  styleUrls: ['./add-new-recipe.component.scss'],
})
export class AddNewRecipeComponent implements OnInit {
  public userProfile?: UserProfile | null;
  public mode: string = 'create';
  public imagePreview!: string;
  public processIsFinished: boolean = false;
  public processIsFinishedSuccessfully: boolean = false;
  public products: Product[] = [];
  public productsEdit: Product[] = [];
  public productsAreValid: boolean = false;
  public productIdIsChosen: number = -1;
  public productExistInChosenProduct: boolean = false;
  public steps: RecipeStep[] = [];
  public stepsAreValid: boolean = false;

  private userName!: string;
  private recipeId!: string;

  public mainRecipeDataFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    portions: [1, Validators.required],
    cookingTime: [0, Validators.required],
    level: ['', Validators.required],
    category: ['', Validators.required],
    dietType: ['', Validators.required],
    image: new FormControl(),
  });

  public nutrientsFormGroup = this.formBuilder.group({
    calories: [0, Validators.required],
    carbohydrates: [0, Validators.required],
    fats: [0, Validators.required],
    proteins: [0, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private recipeService: RecipeService,
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.resetInputs();
    this.checkEditOrCreate();
  }

  private getUserData(): void {
    this.accountService.getUserData().subscribe((res) => {
      this.userName = res.user.userName;
    });

    this.authService.userProfile.subscribe((data) => {
      this.userProfile = data;
    });
  }

  private resetInputs(): void {
    this.mainRecipeDataFormGroup.get('portions')?.disable();
    this.mainRecipeDataFormGroup.get('cookingTime')?.reset();
    this.nutrientsFormGroup.get('calories')?.reset();
    this.nutrientsFormGroup.get('carbohydrates')?.reset();
    this.nutrientsFormGroup.get('fats')?.reset();
    this.nutrientsFormGroup.get('proteins')?.reset();
  }

  private checkEditOrCreate(): void {
    //if active route have recipe Id then update recipe or add new recipe
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        const recipeId = paramMap.get('recipeId') || '';

        this.recipeService.getRecipeDetailEdit(recipeId).subscribe({
          error: (err) => {
            if (err.status === 500) {
              this.router.navigate(['/not-found']);
            }
          },
          next: (res) => {
            if (res.RecipeDetail.userId !== this.userProfile?.id) {
              this.router.navigate(['/not-found']);
            } else {
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
              this.steps = recipeSteps;
              this.products = products;
              this.checkProducts();
              this.recipeId = res.RecipeDetail.id;
              this.imagePreview = res.RecipeDetail.image;
              this.mainRecipeDataFormGroup.patchValue(res.RecipeDetail);
              this.nutrientsFormGroup.patchValue(res.RecipeDetail);

              this.changeDetectorRef.detectChanges();
            }
          },
        });
      } else {
        this.mode = 'create';
        this.products = [{ id: 0, name: '', quantity: 0, measureUnit: '' }];
        this.steps = [{ id: 0, name: '' }];
      }
    });
  }

  public increasePersonCount(): void {
    const currentPersonCount =
      this.mainRecipeDataFormGroup.get('portions')?.value;
    if (currentPersonCount) {
      this.mainRecipeDataFormGroup
        .get('portions')
        ?.setValue(currentPersonCount + 1);
    }
  }

  public decreasePersonCount(): void {
    const currentPersonCount =
      this.mainRecipeDataFormGroup.get('portions')?.value;
    if (currentPersonCount && currentPersonCount !== 1) {
      this.mainRecipeDataFormGroup
        .get('portions')
        ?.setValue(currentPersonCount - 1);
      this.mainRecipeDataFormGroup.updateValueAndValidity;
    }
  }

  public processFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files;
    this.mainRecipeDataFormGroup.get('image')?.setValue(file![0]);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file![0]);
  }

  public addAnotherProduct(): void {
    this.products.push({
      id: 0,
      name: '',
      measureUnit: '',
      quantity: 0,
    });
    this.checkProducts();
  }

  public saveProductData(data: any, index: number): void {
    this.products[index].id = data.id;
    this.products[index].name = data.name;
    this.products[index].quantity = data.quantity;
    this.products[index].measureUnit = data.measureUnit;
    this.checkProducts();
  }

  public deleteProduct(index: number): void {
    this.products.splice(index, 1);
    this.checkProducts();
  }

  private checkProducts(): void {
    this.productsAreValid = true;
    this.productIdIsChosen = -1;
    this.productExistInChosenProduct = false;

    if (this.products.length > 0) {
      let lastProducts = this.products[this.products.length - 1];
      this.products.forEach((product, index, products) => {
        if (index !== products.length - 1 && lastProducts?.id) {
          if (product.id === lastProducts.id) {
            this.productExistInChosenProduct = true;
          }
        }
      });

      if (this.productExistInChosenProduct && lastProducts.id) {
        this.productIdIsChosen = lastProducts.id;
      }
    }

    this.products.forEach((product) => {
      if (
        !product.name ||
        !product.quantity ||
        !product.measureUnit ||
        product.quantity <= 0 ||
        product.quantity > 10000 ||
        this.productExistInChosenProduct
      ) {
        this.productsAreValid = false;
      }
    });
  }

  public addAnotherRecipeStep(): void {
    this.steps.push({ id: 0, name: '' });
    this.checkRecipeStep();
  }

  public saveRecipeStepData(data: any, index: number): void {
    this.steps[index].id = index;
    this.steps[index].name = data.name;
    this.checkRecipeStep();
  }

  public deleteRecipeStep(index: number): void {
    this.steps.splice(index, 1);
    this.checkRecipeStep();
  }

  private checkRecipeStep(): void {
    this.stepsAreValid = true;
    this.steps.forEach((recipeStep) => {
      if (!recipeStep.name) {
        this.stepsAreValid = false;
      }
    });
  }

  public addNewRecipe(): void {
    this.products.forEach((product) => {
      delete product['measureUnit'];
    });

    let recipeAddData: RecipeAddData = {
      name: this.mainRecipeDataFormGroup.get('name')?.value || '',
      description: this.mainRecipeDataFormGroup.get('description')?.value || '',
      cookingTime: this.mainRecipeDataFormGroup.get('cookingTime')?.value || 1,
      portions: this.mainRecipeDataFormGroup.get('portions')?.value || 1,
      level: this.mainRecipeDataFormGroup.get('level')?.value || 'łatwy',
      category:
        this.mainRecipeDataFormGroup.get('category')?.value || 'śniadanie',
      dietType: this.mainRecipeDataFormGroup.get('dietType')?.value || 'inna',
      author: this.userName,
      calories: this.nutrientsFormGroup.get('calories')?.value || 1,
      fats: this.nutrientsFormGroup.get('fats')?.value || 1,
      proteins: this.nutrientsFormGroup.get('proteins')?.value || 1,
      carbohydrates: this.nutrientsFormGroup.get('carbohydrates')?.value || 1,
      products: JSON.stringify(this.products),
      steps: JSON.stringify(this.steps),
    };
    const recipeImage = this.mainRecipeDataFormGroup.get('image')?.value;

    if (this.mode === 'edit') {
      recipeAddData = { id: this.recipeId, ...recipeAddData };
      this.recipeService
        .updateRecipe(recipeImage, recipeAddData)
        .subscribe((res) => {
          if (res.message === 'Zaktualizowano wybrany przepis!') {
            this.processIsFinished = true;
            this.processIsFinishedSuccessfully = true;
          } else {
            this.processIsFinished = true;
            this.processIsFinishedSuccessfully = false;
          }
        });
    } else {
      this.recipeService
        .addRecipe(recipeImage, recipeAddData)
        .subscribe((res) => {
          if (res.message === 'Stworzono nowy przepis!') {
            this.processIsFinished = true;
            this.processIsFinishedSuccessfully = true;
          } else {
            this.processIsFinished = true;
            this.processIsFinishedSuccessfully = false;
          }
        });
    }
  }
}
