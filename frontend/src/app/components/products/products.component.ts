import { Product } from './../../interfaces/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, Observable } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageConsts } from '../../consts/localstorage-consts';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  filteredProducts?: Observable<Product[]>;
  inputMeasureUnit: string = '';
  chosenProducts: Product[] = [];
  chosenproductId?: number;
  chosenProductDataAreCorrect: boolean = false;
  productIsChosen: boolean = false;

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

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.productForm = this.formBuilder.group({
      product: [''],
      quantity: [''],
    });

    this.filteredProducts = this.productForm.get('product')?.valueChanges.pipe(
      map((product) => {
        const name = typeof product === 'string' ? product : product?.name;
        return name
          ? this.products.filter((product) =>
              product.name.toLowerCase().includes(name.toLowerCase())
            )
          : this.products.slice();
      })
    );

    this.productForm?.valueChanges.subscribe(() => {
      this.checkValidation();
    });
  }

  ngOnInit(): void {
    this.productForm.get('quantity')?.disable();

    const dataFromLocalStorage =
      this.localStorageService.getItemFromLocalStorage<Product[]>(
        LocalStorageConsts.PRODUCTS
      );
    if (dataFromLocalStorage) {
      this.chosenProducts = dataFromLocalStorage;
    }
  }

  checkProductExist() {
    this.productForm.get('quantity')?.reset();
    this.productForm.get('quantity')?.disable();
    this.inputMeasureUnit = '';
    this.productIsChosen = false;

    const productName =
      typeof this.productForm.get('product')?.value === 'string'
        ? this.productForm.get('product')?.value
        : this.productForm.get('product')?.value.name;

    this.products.forEach((product) => {
      const productIdExistInChosenProducts = this.chosenProducts.find(
        (product) => product.id === this.productForm.get('product')?.value.id
      );

      if (productIdExistInChosenProducts) {
        this.productIsChosen = true;
      }

      if (
        product.name.toLowerCase() === productName.toLowerCase() &&
        product.id &&
        !this.productIsChosen
      ) {
        this.inputMeasureUnit = product.measureUnit;
        this.chosenproductId = product.id;
        this.productForm.get('quantity')?.enable();
      }
    });
  }

  addProduct() {
    this.chosenProducts.push({
      id: this.chosenproductId,
      name: this.productForm.get('product')?.value.name,
      measureUnit: this.inputMeasureUnit,
      quantity: this.productForm.get('quantity')?.value,
    });

    this.localStorageService.setItemToLocalStorage(
      LocalStorageConsts.PRODUCTS,
      this.chosenProducts
    );

    this.productForm.get('product')?.setValue('');
    this.productForm.get('quantity')?.reset();
    this.inputMeasureUnit = '';
  }

  deleteProduct(index: number) {
    this.chosenProducts.splice(index, 1);
    this.localStorageService.setItemToLocalStorage(
      LocalStorageConsts.PRODUCTS,
      this.chosenProducts
    );
  }

  checkValidation() {
    if (
      this.productForm.get('product')?.value &&
      this.productForm.get('quantity')?.value
    ) {
      this.chosenProductDataAreCorrect = true;
    } else {
      this.chosenProductDataAreCorrect = false;
    }
  }

  getProductName(product: Product) {
    return product.name;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.chosenProducts,
      event.previousIndex,
      event.currentIndex
    );
  }
}
