import { Product } from './../../interfaces/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAllProductsDialogComponent } from './delete-all-products-dialog/delete-all-products-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  public productForm: FormGroup;
  public filteredProducts?: Observable<Product[]>;
  public inputMeasureUnit: string = '';
  public chosenProducts: Product[] = [];
  public chosenproductId?: number;
  public productIsChosen: boolean = false;
  public productDoesntExist: boolean = false;
  public products!: Product[];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    this.productForm = this.formBuilder.group({
      product: [''],
      quantity: [''],
    });

    this.getFilteredProducts();
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllUserProducts();
    this.productForm.get('quantity')?.disable();
  }

  private getFilteredProducts(): void {
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

  private getAllProducts(): void {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res.data.allProducts;
    });
  }

  private getAllUserProducts(): void {
    this.chosenProducts = [];
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
  }

  public checkProductExist(): void {
    this.resetQuantityInput();
    this.productIsChosen = false;
    this.productDoesntExist = false;

    //check product is string or object
    const productName =
      typeof this.productForm.get('product')?.value === 'string'
        ? this.productForm.get('product')?.value
        : this.productForm.get('product')?.value.name;

    const productIdExistInChosenProducts = this.chosenProducts.find(
      (product) => product.id === this.productForm.get('product')?.value.id
    );

    if (productIdExistInChosenProducts) {
      this.productIsChosen = true;
    }

    this.products.forEach((product: Product) => {
      if (
        product.name.toLowerCase() === productName.toLowerCase() &&
        this.productForm.get('product')?.value.id &&
        !this.productIsChosen &&
        product.measureUnit
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

  public addProduct(): void {
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

  public deleteProduct(index: number): void {
    this.productService
      .deleteUserProduct(this.chosenProducts[index].id!)
      .subscribe(() => {
        this.chosenProducts.splice(index, 1);
      });

    this.snackBar.open('Usunięto produkt.', '', { duration: 1500 });
  }

  public checkValidation(): boolean {
    if (
      this.productForm.get('quantity')?.value &&
      this.productForm.get('quantity')?.value > 0 &&
      this.productForm.get('product')?.value.name
    ) {
      return true;
    }
    return false;
  }

  public getProductName(product: Product): string {
    return product.name;
  }

  private resetQuantityInput(): void {
    this.productForm.get('quantity')?.reset();
    this.productForm.get('quantity')?.disable();
    this.inputMeasureUnit = '';
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.chosenProducts,
      event.previousIndex,
      event.currentIndex
    );
  }

  public deleteAllUserProducts(): void {
    this.dialog
      .open(DeleteAllProductsDialogComponent, {
        width: '500px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.productService.deleteAllUserProducts().subscribe((res) => {
            setTimeout(() => {
              this.getAllUserProducts();
            }, 1);
          });
        }
      });
  }
}
