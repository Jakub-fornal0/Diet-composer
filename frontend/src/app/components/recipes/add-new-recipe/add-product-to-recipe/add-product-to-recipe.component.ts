import { Product } from './../../../../interfaces/product.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product-to-recipe',
  templateUrl: './add-product-to-recipe.component.html',
  styleUrls: ['./add-product-to-recipe.component.scss'],
})
export class AddProductToRecipeComponent implements OnInit {
  @Input() product?: Product;
  @Input() productIdIsChosen?: number;
  @Output() returnProductData = new EventEmitter<Product>();
  @Output() productToDelete = new EventEmitter();

  public products!: Product[];
  public addProductForm: FormGroup;
  public filteredProducts?: Observable<Product[]>;
  public inputMeasureUnit: string = '';
  public productDoesntExist: boolean = false;
  public productIsChosen: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    this.addProductForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productQuantity: [0, Validators.required],
    });

    this.addProductForm.get('productQuantity')?.reset();
    this.getFilteredProducts();
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.setProduct();

    this.addProductForm.valueChanges.subscribe(() => {
      this.returnProductData.emit({
        id: this.addProductForm.get('productName')?.value.id,
        name: this.addProductForm.get('productName')?.value.name,
        measureUnit: this.addProductForm.get('productName')?.value.measureUnit,
        quantity: this.addProductForm.get('productQuantity')?.value,
      });
    });
  }

  private getFilteredProducts(): void {
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

  private getAllProducts(): void {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res.data.allProducts;
    });
  }

  private setProduct(): void {
    if (this.product && this.product?.measureUnit) {
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
  }

  public getProductName(product: Product): string {
    return product.name;
  }

  public checkProductExist(): void {
    this.resetQuantityInput();
    this.productDoesntExist = false;
    this.productIsChosen = false;

    const productName =
      typeof this.addProductForm.get('productName')?.value === 'string'
        ? this.addProductForm.get('productName')?.value
        : this.addProductForm.get('productName')?.value.name;

    this.products.forEach((product: Product) => {
      if (
        product.name.toLowerCase() === productName.toLowerCase() &&
        product.id &&
        product.measureUnit
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

    if (
      this.productIdIsChosen ===
      this.addProductForm.get('productName')?.value.id
    ) {
      this.productDoesntExist = false;
      this.productIsChosen = true;
      this.inputMeasureUnit = '';
      this.addProductForm.get('productQuantity')?.disable();
    }
  }

  private resetQuantityInput(): void {
    this.addProductForm.get('productQuantity')?.reset();
    this.addProductForm.get('productQuantity')?.disable();
    this.inputMeasureUnit = '';
  }

  public deleteProduct(): void {
    this.productToDelete.emit();
  }
}
