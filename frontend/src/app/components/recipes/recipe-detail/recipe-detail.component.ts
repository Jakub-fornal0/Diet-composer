import { RecipeDetail } from './../../../interfaces/recipe.model';
import { Component, OnInit } from '@angular/core';
import { RecipeStepConsts } from '../../../consts/recipe-step-consts';
import { Product } from '../../../interfaces/product.model';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipeToScheduleComponent } from '../add-recipe-to-schedule/add-recipe-to-schedule.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  products: Product[] = [];
  recipeSteps: string[] = [];

  // _________________________MOCKUP _________________________//
  recipe: RecipeDetail = {
    id: '1',
    image: 'assets/zdj.jpg',
    name: 'Zapiekanka makaronowa',

    cookingTime: 45,
    portions: 4,
    level: 'Łatwy',
    products: [
      { id: 5, name: 'makaron pióra', quantity: 200, measureUnit: 'g' },
      { id: 7, name: 'pierś z kurczaka', quantity: 0.2, measureUnit: 'kg' },
      { id: 12, name: 'cebula', quantity: 1, measureUnit: 'szt' },
      {
        id: 13,
        name: 'przecier pomidorowy',
        quantity: 150,
        measureUnit: 'ml',
      },
      { id: 67, name: 'pomidor', quantity: 150, measureUnit: 'g' },
      { id: 15, name: 'ser zółty', quantity: 300, measureUnit: 'g' },
      { id: 10, name: 'olej rzepakowy', quantity: 0.25, measureUnit: 'l' },
      { id: 18, name: 'woda', quantity: 250, measureUnit: 'ml' },
    ],
    recipeStep: [
      {
        id: '1',
        stepName: 'Cebulę pokrój w piórka, czosnek przeciśnij przez praskę.',
      },
      { id: '1', stepName: 'Podsmaż je na oleju.' },
      { id: '1', stepName: 'Ugotuj makaron na sposób al dente.' },
      {
        id: '1',
        stepName:
          'Warzywa pokrój w paski i wraz z kurczakiem dodaj do całości. Duś około 15 minut.',
      },
      {
        id: '1',
        stepName:
          'Następnie podlej szklanką wody i dodaj kostkę Rosołu z kury Knorr oraz przecier pomidorowy.',
      },
      {
        id: '1',
        stepName:
          'Makaron wyłóż do naczynia żaroodpornego, zalej sosem i posyp startym serem.',
      },
      {
        id: '1',
        stepName:
          'Włóż do piekarnika nagrzanego do 180 stopni na 20 minut. Następnie podawaj.',
      },
    ],
    author: 'Pędzimąż Andrzej',
    calories: 500,
    fats: 1,
    proteins: 2,
    carbohydrates: 3,
  };
  // _________________________________________________//

  constructor(
    private dialog: MatDialog,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getAllUserProducts().subscribe((res) => {
      //ZMIENIC PRODUKTY NA INNA NAZWE
      res.Produkty.forEach((product: any) => {
        this.products.push({
          id: product.id,
          name: product.product.name,
          measureUnit: product.product.measureUnit,
          quantity: product.quantity,
        });
      });
    });

    this.recipe.recipeStep.forEach(() =>
      this.recipeSteps.push(RecipeStepConsts.TODO)
    );
    this.recipeSteps[0] = RecipeStepConsts.DOING;
  }

  checkUserHaveProduct(recipeProduct: Product): boolean {
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

  checkDisabled(i: number): boolean {
    if (this.recipeSteps[i + 1] === RecipeStepConsts.DONE) {
      return true;
    }

    if (i === 0 || this.recipeSteps[i - 1] === RecipeStepConsts.DONE) {
      return false;
    }

    return true;
  }

  makeStepAsDone(i: number) {
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

  openAddtoScheduleDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AddRecipeToScheduleComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.recipe,
    });
  }
}
