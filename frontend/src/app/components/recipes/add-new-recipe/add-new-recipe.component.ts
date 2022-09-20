import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AllRecipeData, RecipeStep } from '../../../interfaces/recipe.model';
import { Product } from '../../../interfaces/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-add-new-recipe',
  templateUrl: './add-new-recipe.component.html',
  styleUrls: ['./add-new-recipe.component.scss'],
})
export class AddNewRecipeComponent implements OnInit {
  selectedFile?: ImageSnippet;
  mode: String = 'create';
  recipeId?: string;

  recipe: AllRecipeData = {
    image: '',
    name: '',
    description: '',
    cookingTime: 0,
    portions: 1,
    level: '',
    category: '',
    calories: 0,
    fats: 0,
    proteins: 0,
    carbohydrates: 0,
    products: [{ id: 0, name: '', quantity: 0, measureUnit: '' }],
    recipeStep: [{ id: 0, stepName: '' }],
  };

  mainRecipeDataFormGroup = this.formBuilder.group({
    recipeName: [this.recipe.name, Validators.required],
    recipeDescription: [this.recipe.description, Validators.required],
    recipeImage: [this.recipe.image, Validators.required],
    recipePersonCount: [this.recipe.portions, Validators.required],
    recipeTime: [this.recipe.cookingTime, Validators.required],
    recipeLevel: [this.recipe.level, Validators.required],
    recipeCategory: [this.recipe.category, Validators.required],
  });

  nutrientsFormGroup = this.formBuilder.group({
    calories: [this.recipe.calories, Validators.required],
    carbohydrates: [this.recipe.carbohydrates, Validators.required],
    fats: [this.recipe.fats, Validators.required],
    proteins: [this.recipe.proteins, Validators.required],
  });

  recipeProducts: Product[] = this.recipe.products;
  recipeProductsAreValid: boolean = false;

  recipeSteps: RecipeStep[] = this.recipe.recipeStep;
  recipeStepsAreValid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mainRecipeDataFormGroup.get('recipePersonCount')?.disable();

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        this.recipeId = paramMap.get('recipeId') || '';

        // TU BEDZIE WYWOLANIE SERWISU KTORY POBIERZE DANE PRZEPISU PO ID I PRZYPISZE DO ZMIENNEJ
        this.mainRecipeDataFormGroup.get('recipeName')?.setValue('Makaron');
        this.mainRecipeDataFormGroup
          .get('recipeDescription')
          ?.setValue('Makaron Makaron Makaron Makaron Makaron Makaron');
        this.mainRecipeDataFormGroup.get('recipeImage')?.setValue('');
        this.mainRecipeDataFormGroup.get('recipePersonCount')?.setValue(4);
        this.mainRecipeDataFormGroup.get('recipeTime')?.setValue(50);
        this.mainRecipeDataFormGroup.get('recipeLevel')?.setValue('Łatwy');
        this.mainRecipeDataFormGroup.get('recipeCategory')?.setValue('Obiad');

        this.nutrientsFormGroup.get('calories')?.setValue(150);
        this.nutrientsFormGroup.get('carbohydrates')?.setValue(150);
        this.nutrientsFormGroup.get('fats')?.setValue(150);
        this.nutrientsFormGroup.get('proteins')?.setValue(150);

        this.recipeProducts = [
          { id: 6, name: 'makaron pióra', quantity: 200, measureUnit: 'g' },
          { id: 5, name: 'pierś z kurczaka', quantity: 2, measureUnit: 'kg' },
          { id: 12, name: 'cebula', quantity: 1, measureUnit: 'szt' },
          { id: 13, name: 'przecier', quantity: 150, measureUnit: 'ml' },
          { id: 7, name: 'pomidor', quantity: 150, measureUnit: 'g' },
          { id: 15, name: 'ser zółty', quantity: 300, measureUnit: 'g' },
          { id: 10, name: 'olej rzepakowy', quantity: 132, measureUnit: 'l' },
          { id: 18, name: 'woda', quantity: 250, measureUnit: 'ml' },
        ];

        this.recipeSteps = [
          {
            id: 1,
            stepName:
              'Cebulę pokrój w piórka, czosnek przeciśnij przez praskę.',
          },
          { id: 2, stepName: 'Podsmaż je na oleju.' },
          { id: 3, stepName: 'Ugotuj makaron na sposób al dente.' },
          {
            id: 4,
            stepName:
              'Warzywa pokrój w paski i wraz z kurczakiem dodaj do całości. Duś około 15 minut.',
          },
          {
            id: 5,
            stepName:
              'Następnie podlej szklanką wody i dodaj kostkę Rosołu z kury Knorr oraz przecier pomidorowy.',
          },
          {
            id: 6,
            stepName:
              'Makaron wyłóż do naczynia żaroodpornego, zalej sosem i posyp startym serem.',
          },
          {
            id: 7,
            stepName:
              'Włóż do piekarnika nagrzanego do 180 stopni na 20 minut. Następnie podawaj.',
          },
        ];

        ////////////////////////////////////////////////////////////////////////////////////////
      } else {
        this.mode = 'create';
        this.recipeId = '';
      }
    });
  }

  increasePersonCount() {
    const currentPersonCount =
      this.mainRecipeDataFormGroup.get('recipePersonCount')?.value;
    if (currentPersonCount) {
      this.mainRecipeDataFormGroup
        .get('recipePersonCount')
        ?.setValue(currentPersonCount + 1);
    }
  }

  decreasePersonCount() {
    const currentPersonCount =
      this.mainRecipeDataFormGroup.get('recipePersonCount')?.value;
    if (currentPersonCount && currentPersonCount !== 1) {
      this.mainRecipeDataFormGroup
        .get('recipePersonCount')
        ?.setValue(currentPersonCount - 1);
      this.mainRecipeDataFormGroup.updateValueAndValidity;
    }
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }

  addAnotherProduct() {
    this.recipeProducts.push({
      id: 0,
      name: '',
      measureUnit: '',
      quantity: 0,
    });
    this.checkProducts();
  }

  saveProductData(data: any, index: number) {
    this.recipeProducts[index].id = data.productName.id;
    this.recipeProducts[index].name = data.productName.name;
    this.recipeProducts[index].quantity = data.productQuantity;
    this.recipeProducts[index].measureUnit = data.productName.measureUnit;
    this.checkProducts();
  }

  deleteProduct(index: number) {
    this.recipeProducts.splice(index, 1);
    this.checkProducts();
  }

  checkProducts() {
    this.recipeProductsAreValid = true;
    this.recipeProducts.forEach((product) => {
      if (
        !product.name ||
        !product.quantity ||
        !product.measureUnit ||
        product.quantity <= 0 ||
        product.quantity > 10000
      ) {
        this.recipeProductsAreValid = false;
      }
    });
  }

  addAnotherRecipeStep() {
    this.recipeSteps.push({ id: 0, stepName: '' });
    this.checkRecipeStep();
  }

  saveRecipeStepData(data: any, index: number) {
    this.recipeSteps[index].id = index;
    this.recipeSteps[index].stepName = data.stepName;
    this.checkRecipeStep();
  }

  deleteRecipeStep(index: number) {
    this.recipeSteps.splice(index, 1);
    this.checkRecipeStep();
  }

  checkRecipeStep() {
    this.recipeStepsAreValid = true;
    this.recipeSteps.forEach((recipeStep) => {
      if (!recipeStep.stepName) {
        this.recipeStepsAreValid = false;
      }
    });
  }

  addNewRecipe() {}
}
