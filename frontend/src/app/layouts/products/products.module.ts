import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../materialUI/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './products.component';
import { DeleteAllProductsDialogComponent } from './delete-all-products-dialog/delete-all-products-dialog.component';

@NgModule({
  entryComponents: [ProductsComponent],
  declarations: [ProductsComponent, DeleteAllProductsDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [ProductsComponent],
})
export class ProductsModule {}
