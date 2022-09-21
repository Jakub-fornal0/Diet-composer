import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  mainRecipeDataFormGroup = this.formBuilder.group({
    recipeName: ['', Validators.required],
    recipeDescription: ['', Validators.required],
    recipeImage: ['', Validators.required],
    recipePersonCount: [1, Validators.required],
    recipeTime: [0, Validators.required],
    recipeLevel: ['', Validators.required],
    recipeCategory: ['', Validators.required],
  });

  nutrientsFormGroup = this.formBuilder.group({
    calories: [0, Validators.required],
    carbohydrates: [0, Validators.required],
    fats: [0, Validators.required],
    proteins: [0, Validators.required],
  });

  recipeProducts: Product[] = [];
  recipeProductsEdit: Product[] = [];
  recipeProductsAreValid: boolean = false;

  recipeSteps: RecipeStep[] = [];
  recipeStepsAreValid: boolean = false;

  recipeAllData: AllRecipeData = {
    image: '',
    name: '',
    description: '',
    cookingTime: 0,
    portions: 0,
    level: '',
    category: '',
    calories: 0,
    fats: 0,
    proteins: 0,
    carbohydrates: 0,
    products: [{ id: 0, name: '', quantity: 0, measureUnit: '' }],
    recipeStep: [{ id: 0, stepName: '' }],
  };

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mainRecipeDataFormGroup.get('recipePersonCount')?.disable();
    this.mainRecipeDataFormGroup.get('recipeTime')?.reset();
    this.nutrientsFormGroup.get('calories')?.reset();
    this.nutrientsFormGroup.get('carbohydrates')?.reset();
    this.nutrientsFormGroup.get('fats')?.reset();
    this.nutrientsFormGroup.get('proteins')?.reset();

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        this.recipeId = paramMap.get('recipeId') || '';

        // TU BEDZIE WYWOLANIE SERWISU KTORY POBIERZE DANE PRZEPISU PO ID I PRZYPISZE DO ZMIENNEJ
        // ZROBIC SPRAWDZENIE JESLI ID USERA JEST ROZNE OD ID TWORCY PRZEPISU ZROBIC NAWIGACJE NA PRZEPISY
        // JESLI ID SIE ZGADZAJA ZROBIC TO CO PONIZEJ
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

        this.recipeProductsEdit = [
          { id: 11, name: 'mleko 1,5%', measureUnit: 'l', quantity: 100 },
          { id: 1, name: 'mleko 2%', measureUnit: 'l', quantity: 4 },
          { id: 2, name: 'śmietana 12%', measureUnit: 'g', quantity: 400 },
          { id: 3, name: 'mąka', measureUnit: 'kg', quantity: 23 },
          { id: 4, name: 'jaja rozmiar M', measureUnit: 'szt', quantity: 10 },
          { id: 5, name: 'pierś z kurczaka', measureUnit: 'kg', quantity: 2 },
          { id: 6, name: 'makaron pióra', measureUnit: 'g', quantity: 450 },
          { id: 7, name: 'pomidor', measureUnit: 'g', quantity: 200 },
          { id: 8, name: 'ryż', measureUnit: 'g', quantity: 200 },
        ];

        this.recipeProducts = [];
        this.recipeProductsEdit.forEach((product) => {
          this.recipeProducts.push(product);
        });
        this.checkProducts();

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
        this.changeDetectorRef.detectChanges();
        ////////////////////////////////////////////////////////////////////////////////////////
      } else {
        this.mode = 'create';
        this.recipeProducts = [
          { id: 0, name: '', quantity: 0, measureUnit: '' },
        ];
        this.recipeSteps = [{ id: 0, stepName: '' }];
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
    this.recipeProducts[index].id = data.id;
    this.recipeProducts[index].name = data.name;
    this.recipeProducts[index].quantity = data.quantity;
    this.recipeProducts[index].measureUnit = data.measureUnit;
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

  addNewRecipe() {
    this.recipeAllData.name =
      this.mainRecipeDataFormGroup.get('recipeName')?.value || '';
    this.recipeAllData.description =
      this.mainRecipeDataFormGroup.get('recipeDescription')?.value || '';
    this.recipeAllData.image =
      this.mainRecipeDataFormGroup.get('recipeImage')?.value || '';
    this.recipeAllData.portions =
      this.mainRecipeDataFormGroup.get('recipePersonCount')?.value || 0;
    this.recipeAllData.cookingTime =
      this.mainRecipeDataFormGroup.get('recipeTime')?.value || 0;
    this.recipeAllData.level =
      this.mainRecipeDataFormGroup.get('recipeLevel')?.value || '';
    this.recipeAllData.category =
      this.mainRecipeDataFormGroup.get('recipeCategory')?.value || '';

    this.recipeAllData.calories =
      this.nutrientsFormGroup.get('calories')?.value || 0;
    this.recipeAllData.carbohydrates =
      this.nutrientsFormGroup.get('carbohydrates')?.value || 0;
    this.recipeAllData.fats = this.nutrientsFormGroup.get('fats')?.value || 0;
    this.recipeAllData.proteins =
      this.nutrientsFormGroup.get('proteins')?.value || 0;

    this.recipeAllData.products = this.recipeProducts;
    this.recipeAllData.recipeStep = this.recipeSteps;

    if (this.mode === 'edit') {
      //WYWOLAC ENDPOINT Z EDIT
    } else {
      //WYWOLAC ENDPOINT Z CREATE
    }
  }
}