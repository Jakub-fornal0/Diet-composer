import { Product } from './../../interfaces/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  filteredProducts?: Observable<Product[]>;
  productId?: number;
  inputMeasureUnit: string = '';
  chosenProducts: Product[] = [];

  // mockup produktów DO USUNIECIA JAK BEDZIE POLĄCZENIE Z BAZA
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
  // ---------------------------------------------------------//

  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      product: [''],
      quantity: [''],
    });

    this.filteredProducts = this.productForm.get('product')?.valueChanges.pipe(
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this.products.filter((product) =>
              product.name.toLowerCase().includes(name.toLowerCase())
            )
          : this.products.slice();
      })
    );
  }

  ngOnInit(): void {
    this.productForm.get('quantity')?.disable();
  }

  checkProductExist() {
    this.productForm.get('quantity')?.disable();
    this.inputMeasureUnit = '';
    const productName =
      typeof this.productForm.get('product')?.value === 'string'
        ? this.productForm.get('product')?.value
        : this.productForm.get('product')?.value.name;

    this.products.forEach((product) => {
      if (
        product.name.toLowerCase() === productName.toLowerCase() &&
        product.id
      ) {
        this.inputMeasureUnit = product.measureUnit;
        this.productId = product.id;
        this.productForm.get('quantity')?.enable();
      }
    });
  }

  add() {
    this.chosenProducts.push({
      id: this.productId,
      name: this.productForm.get('product')?.value.name,
      measureUnit: this.inputMeasureUnit,
      quantity: this.productForm.get('quantity')?.value,
    });
    console.log(this.chosenProducts);
    this.productForm.get('product')?.setValue('');
    this.productForm.get('quantity')?.reset();
    this.inputMeasureUnit = '';
  }

  getProductName(product: Product) {
    return product.name;
  }
}
