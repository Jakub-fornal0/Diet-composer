import { Product } from './../../interfaces/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';

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
  productIsChosen: boolean = false;
  productDoesntExist: boolean = false;
  products!: Product[];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private productService: ProductService
  ) {
    this.productForm = this.formBuilder.group({
      product: [''],
      quantity: [''],
    });

    this.filteredProducts = this.productForm.get('product')?.valueChanges.pipe(
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
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res.data.allProducts;
    });

    this.productService.getAllUserProducts().subscribe((res) => {
      res.Products.forEach((product: any) => {
        this.chosenProducts.push({
          id: product.product.id,
          name: product.product.name,
          measureUnit: product.product.measureUnit,
          quantity: product.quantity,
        });
      });
    });

    this.productForm.get('quantity')?.disable();
  }

  checkProductExist() {
    this.resetQuantityInput();
    this.productIsChosen = false;
    this.productDoesntExist = false;

    const productName =
      typeof this.productForm.get('product')?.value === 'string'
        ? this.productForm.get('product')?.value
        : this.productForm.get('product')?.value.name;

    this.products.forEach((product: Product) => {
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
        this.productDoesntExist = false;
        this.inputMeasureUnit = product.measureUnit;
        this.chosenproductId = product.id;
        this.productForm.get('quantity')?.enable();
      }

      if (
        product.name.toLowerCase() !== productName.toLowerCase() &&
        this.productForm.get('product')?.value.length
      ) {
        this.productDoesntExist = true;
        this.resetQuantityInput();
      }
    });
  }

  addProduct() {
    const product: Product = {
      id: this.chosenproductId,
      name: this.productForm.get('product')?.value.name,
      measureUnit: this.inputMeasureUnit,
      quantity: this.productForm.get('quantity')?.value,
    };

    this.productService.addUserProduct(product).subscribe(() => {
      this.chosenProducts.push(product);
    });

    this.snackBar.open('Dodano produkt.', '', { duration: 1500 });
    this.productForm.get('product')?.setValue('');
    this.resetQuantityInput();
  }

  deleteProduct(index: number) {
    this.productService
      .deleteUserProduct(this.chosenProducts[index].id!)
      .subscribe(() => {
        this.chosenProducts.splice(index, 1);
      });

    this.snackBar.open('Usunięto produkt.', '', { duration: 1500 });
  }

  checkValidation(): boolean {
    if (
      this.productForm.get('quantity')?.value &&
      this.productForm.get('quantity')?.value > 0 &&
      this.productForm.get('product')?.value.name
    ) {
      return true;
    }
    return false;
  }

  getProductName(product: Product) {
    return product.name;
  }

  resetQuantityInput() {
    this.productForm.get('quantity')?.reset();
    this.productForm.get('quantity')?.disable();
    this.inputMeasureUnit = '';
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.chosenProducts,
      event.previousIndex,
      event.currentIndex
    );
  }
}
