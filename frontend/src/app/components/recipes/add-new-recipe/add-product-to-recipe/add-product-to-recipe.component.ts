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
  products!: Product[];

  @Input() product?: Product;
  @Output() returnProductData = new EventEmitter<Product>();
  @Output() productToDelete = new EventEmitter();

  addProductForm: FormGroup;
  filteredProducts?: Observable<Product[]>;
  inputMeasureUnit: string = '';
  productDoesntExist: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
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
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res.data.allProducts;
    });

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
