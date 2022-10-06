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
      id: '11',
      name: 'mleko 1,5%',
      measureUnit: 'l',
    },
    {
      id: '1',
      name: 'mleko 2%',
      measureUnit: 'l',
    },
    {
      id: '2',
      name: 'śmietana 12%',
      measureUnit: 'g',
    },
    {
      id: '3',
      name: 'mąka',
      measureUnit: 'kg',
    },
    {
      id: '4',
      name: 'jaja rozmiar M',
      measureUnit: 'szt',
    },
    {
      id: '5',
      name: 'pierś z kurczaka',
      measureUnit: 'kg',
    },
    {
      id: '6',
      name: 'makaron pióra',
      measureUnit: 'g',
    },
    {
      id: '7',
      name: 'pomidor',
      measureUnit: 'g',
    },
    {
      id: '8',
      name: 'ryż',
      measureUnit: 'g',
    },
    {
      id: '9',
      name: 'mięso mielone',
      measureUnit: 'g',
    },
    {
      id: '10',
      name: 'olej rzepakowy',
      measureUnit: 'l',
    },
  ];

  @Input() product?: Product;
  @Output() returnProductData = new EventEmitter<Product>();
  @Output() productToDelete = new EventEmitter();

  addProductForm: FormGroup;
  filteredProducts?: Observable<Product[]>;
  inputMeasureUnit: string = '';
  productDoesntExist: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.addProductForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productQuantity: [0, Validators.required],
    });

    this.addProductForm.get('productQuantity')?.reset();

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
  }

  ngOnInit(): void {
    if (this.product) {
      const productName = {
        id: this.product?.id,
        name: this.product?.name,
        measureUnit: this.product?.measureUnit,
      };
      this.addProductForm.get('productName')?.setValue(productName);
      this.addProductForm
        .get('productQuantity')
        ?.setValue(this.product?.quantity);
      this.inputMeasureUnit = this.product?.measureUnit;
    } else {
      this.addProductForm.get('productQuantity')?.disable();
    }

    this.addProductForm.valueChanges.subscribe(() => {
      this.returnProductData.emit({
        id: this.addProductForm.get('productName')?.value.id,
        name: this.addProductForm.get('productName')?.value.name,
        measureUnit: this.addProductForm.get('productName')?.value.measureUnit,
        quantity: this.addProductForm.get('productQuantity')?.value,
      });
    });
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
