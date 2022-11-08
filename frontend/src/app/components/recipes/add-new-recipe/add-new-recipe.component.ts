import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RecipeAddData, RecipeStep } from '../../../interfaces/recipe.model';
import { Product } from '../../../interfaces/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-add-new-recipe',
  templateUrl: './add-new-recipe.component.html',
  styleUrls: ['./add-new-recipe.component.scss'],
})
export class AddNewRecipeComponent implements OnInit {
  mode: string = 'create';
  recipeId?: string;
  imagePreview!: string;

  mainRecipeDataFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    portions: [1, Validators.required],
    cookingTime: [0, Validators.required],
    level: ['', Validators.required],
    category: ['', Validators.required],
    dietType: ['', Validators.required],
    image: new FormControl(),
  });

  nutrientsFormGroup = this.formBuilder.group({
    calories: [0, Validators.required],
    carbohydrates: [0, Validators.required],
    fats: [0, Validators.required],
    proteins: [0, Validators.required],
  });

  products: Product[] = [];
  productsEdit: Product[] = [];
  productsAreValid: boolean = false;

  steps: RecipeStep[] = [];
  stepsAreValid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.mainRecipeDataFormGroup.get('portions')?.disable();
    this.mainRecipeDataFormGroup.get('cookingTime')?.reset();
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
        // JESLI NIE MA TAKIEGO ID PRZEPISU PRZENIESC NA STRONE 404 NOT FOUND
        // JESLI ID SIE ZGADZAJA ZROBIC TO CO PONIZEJ
        this.mainRecipeDataFormGroup.get('name')?.setValue('Makaron');
        this.mainRecipeDataFormGroup
          .get('description')
          ?.setValue('Makaron Makaron Makaron Makaron Makaron Makaron');
        this.mainRecipeDataFormGroup.get('portions')?.setValue(4);
        this.mainRecipeDataFormGroup.get('cookingTime')?.setValue(50);
        this.mainRecipeDataFormGroup.get('level')?.setValue('łatwy');
        this.mainRecipeDataFormGroup.get('category')?.setValue('obiad');
        this.mainRecipeDataFormGroup.get('dietType')?.setValue('inna');
        this.mainRecipeDataFormGroup.get('image')?.setValue('assets/zdj.jpg');
        this.imagePreview = 'assets/zdj.jpg';

        this.nutrientsFormGroup.get('calories')?.setValue(150);
        this.nutrientsFormGroup.get('carbohydrates')?.setValue(150);
        this.nutrientsFormGroup.get('fats')?.setValue(150);
        this.nutrientsFormGroup.get('proteins')?.setValue(150);

        this.productsEdit = [
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

        this.products = [];
        this.productsEdit.forEach((product) => {
          this.products.push(product);
        });
        this.checkProducts();

        this.steps = [
          {
            id: 1,
            name: 'Cebulę pokrój w piórka, czosnek przeciśnij przez praskę.',
          },
          { id: 2, name: 'Podsmaż je na oleju.' },
          { id: 3, name: 'Ugotuj makaron na sposób al dente.' },
          {
            id: 4,
            name: 'Warzywa pokrój w paski i wraz z kurczakiem dodaj do całości. Duś około 15 minut.',
          },
          {
            id: 5,
            name: 'Następnie podlej szklanką wody i dodaj kostkę Rosołu z kury Knorr oraz przecier pomidorowy.',
          },
          {
            id: 6,
            name: 'Makaron wyłóż do naczynia żaroodpornego, zalej sosem i posyp startym serem.',
          },
          {
            id: 7,
            name: 'Włóż do piekarnika nagrzanego do 180 stopni na 20 minut. Następnie podawaj.',
          },
        ];
        this.changeDetectorRef.detectChanges();
        ////////////////////////////////////////////////////////////////////////////////////////
      } else {
        this.mode = 'create';
        this.products = [{ id: 0, name: '', quantity: 0, measureUnit: '' }];
        this.steps = [{ id: 0, name: '' }];
        this.recipeId = '';
      }
    });
  }

  increasePersonCount() {
    const currentPersonCount =
      this.mainRecipeDataFormGroup.get('portions')?.value;
    if (currentPersonCount) {
      this.mainRecipeDataFormGroup
        .get('portions')
        ?.setValue(currentPersonCount + 1);
    }
  }

  decreasePersonCount() {
    const currentPersonCount =
      this.mainRecipeDataFormGroup.get('portions')?.value;
    if (currentPersonCount && currentPersonCount !== 1) {
      this.mainRecipeDataFormGroup
        .get('portions')
        ?.setValue(currentPersonCount - 1);
      this.mainRecipeDataFormGroup.updateValueAndValidity;
    }
  }

  processFile(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    this.mainRecipeDataFormGroup.get('image')?.setValue(file![0]);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file![0]);
  }

  addAnotherProduct() {
    this.products.push({
      id: 0,
      name: '',
      measureUnit: '',
      quantity: 0,
    });
    this.checkProducts();
  }

  saveProductData(data: any, index: number) {
    this.products[index].id = data.id;
    this.products[index].name = data.name;
    this.products[index].quantity = data.quantity;
    this.products[index].measureUnit = data.measureUnit;
    this.checkProducts();
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.checkProducts();
  }

  checkProducts() {
    this.productsAreValid = true;
    this.products.forEach((product) => {
      if (
        !product.name ||
        !product.quantity ||
        !product.measureUnit ||
        product.quantity <= 0 ||
        product.quantity > 10000
      ) {
        this.productsAreValid = false;
      }
    });
  }

  addAnotherRecipeStep() {
    this.steps.push({ id: 0, name: '' });
    this.checkRecipeStep();
  }

  saveRecipeStepData(data: any, index: number) {
    this.steps[index].id = index;
    this.steps[index].name = data.name;
    this.checkRecipeStep();
  }

  deleteRecipeStep(index: number) {
    this.steps.splice(index, 1);
    this.checkRecipeStep();
  }

  checkRecipeStep() {
    this.stepsAreValid = true;
    this.steps.forEach((recipeStep) => {
      if (!recipeStep.name) {
        this.stepsAreValid = false;
      }
    });
  }

  addNewRecipe() {
    if (this.mode === 'edit') {
      //WYWOLAC ENDPOINT Z EDIT
    } else {
      this.products.forEach((product) => {
        delete product['measureUnit'];
      });

      const recipeAddData: RecipeAddData = {
        name: this.mainRecipeDataFormGroup.get('name')?.value || '',
        description:
          this.mainRecipeDataFormGroup.get('description')?.value || '',
        cookingTime:
          this.mainRecipeDataFormGroup.get('cookingTime')?.value || 1,
        portions: this.mainRecipeDataFormGroup.get('portions')?.value || 1,
        level: this.mainRecipeDataFormGroup.get('level')?.value || 'łatwy',
        category:
          this.mainRecipeDataFormGroup.get('category')?.value || 'śniadanie',
        dietType: this.mainRecipeDataFormGroup.get('dietType')?.value || 'inna',
        author: 'dddddd',
        calories: this.nutrientsFormGroup.get('calories')?.value || 1,
        fats: this.nutrientsFormGroup.get('fats')?.value || 1,
        proteins: this.nutrientsFormGroup.get('proteins')?.value || 1,
        carbohydrates: this.nutrientsFormGroup.get('carbohydrates')?.value || 1,
        products: JSON.stringify(this.products),
        steps: JSON.stringify(this.steps),
      };

      const recipeImage = this.mainRecipeDataFormGroup.get('image')?.value;

      this.recipeService
        .addRecipe(recipeImage, recipeAddData)
        .subscribe((res) => {
          console.log(res);
        });
    }
  }
}
