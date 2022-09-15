import { Product } from './../../../../interfaces/product.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-add-product-to-recipe',
  templateUrl: './add-product-to-recipe.component.html',
  styleUrls: ['./add-product-to-recipe.component.scss'],
})
export class AddProductToRecipeComponent implements OnInit {
  products: Product[] = [
    {
      id: 11,
      name: 'mleko 1,5%',
      measureUnit: 'l',
    },
    {
      id: 1,
      name: 'mleko 2%',
      measureUnit: 'l',
    },
    {
      id: 2,
      name: 'śmietana 12%',
      measureUnit: 'g',
    },
    {
      id: 3,
      name: 'mąka',
      measureUnit: 'kg',
    },
    {
      id: 4,
      name: 'jaja rozmiar M',
      measureUnit: 'szt',
    },
    {
      id: 5,
      name: 'pierś z kurczaka',
      measureUnit: 'kg',
    },
    {
      id: 6,
      name: 'makaron pióra',
      measureUnit: 'g',
    },
    {
      id: 7,
      name: 'pomidor',
      measureUnit: 'g',
    },
    {
      id: 8,
      name: 'ryż',
      measureUnit: 'g',
    },
    {
      id: 9,
      name: 'mięso mielone',
      measureUnit: 'g',
    },
    {
      id: 10,
      name: 'olej rzepakowy',
      measureUnit: 'l',
    },
  ];

  addProductForm: FormGroup;
  filteredProducts?: Observable<Product[]>;
  inputMeasureUnit: string = '';
  productDoesntExist: boolean = false;

  @Output() returnProductData = new EventEmitter<Product>();
  @Output() productToDelete = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.addProductForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productQuantity: ['', Validators.required],
    });

    this.filteredProducts = this.addProductForm
      .get('productName')
      ?.valueChanges.pipe(
        map((product: Product) => {
          const name = typeof product === 'string' ? product : product?.name;
          return name
            ? this.products.filter((product: Product) =>
                product.name.toLowerCase().includes(name.toLowerCase())
              )
            : this.products.slice();
        })
      );

    this.addProductForm.valueChanges.subscribe(() => {
      this.returnProductData.emit(this.addProductForm.value);
    });
  }

  ngOnInit(): void {
    this.addProductForm.get('productQuantity')?.disable();
  }

  getProductName(product: Product) {
    return product.name;
  }

  checkProductExist() {
    this.resetQuantityInput();
    this.productDoesntExist = false;

    const productName =
      typeof this.addProductForm.get('productName')?.value === 'string'
        ? this.addProductForm.get('productName')?.value
        : this.addProductForm.get('productName')?.value.name;

    this.products.forEach((product: Product) => {
      if (
        product.name.toLowerCase() === productName.toLowerCase() &&
        product.id
      ) {
        this.productDoesntExist = false;
        this.inputMeasureUnit = product.measureUnit;
        this.addProductForm.get('productQuantity')?.enable();
      }

      if (
        product.name.toLowerCase() !== productName.toLowerCase() &&
        this.addProductForm.get('productName')?.value.length
      ) {
        this.productDoesntExist = true;
        this.resetQuantityInput();
      }
    });
  }

  resetQuantityInput() {
    this.addProductForm.get('productQuantity')?.reset();
    this.addProductForm.get('productQuantity')?.disable();
    this.inputMeasureUnit = '';
  }

  deleteProduct() {
    this.productToDelete.emit();
  }
}
