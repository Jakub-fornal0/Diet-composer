import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../../interfaces/product.model';

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
  imagePreview?: string;

  mainRecipeDataFormGroup = this._formBuilder.group({
    recipeName: ['d', Validators.required],
    recipeDescription: ['d', Validators.required],
    // recipeImage: ['', Validators.required],
    recipePersonCount: [1, Validators.required],
    recipeTime: [111, Validators.required],
    recipeLevel: ['Łatwy', Validators.required],
  });

  nutrientsFormGroup = this._formBuilder.group({
    calories: ['d', Validators.required],
    carbohydrates: ['d', Validators.required],
    fats: ['d', Validators.required],
    proteins: ['d', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  recipeProducts: Product[] = [
    { id: 0, name: '', measureUnit: '', quantity: 0 },
  ];
  recipeProductsAreValid: boolean = false;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.mainRecipeDataFormGroup.get('recipePersonCount')?.disable();
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
      this.imagePreview = reader.result as string;
    });

    reader.readAsDataURL(file);
  }

  addAnotherProduct() {
    this.recipeProducts.push({ id: 0, name: '', measureUnit: '', quantity: 0 });
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
        product.quantity <= 0
      ) {
        this.recipeProductsAreValid = false;
      }
    });
  }
}
