import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from './../../interfaces/product.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageConsts } from '../../consts/localstorage-consts';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RecipesFilterDialogComponent } from './recipes-filter-dialog/recipes-filter-dialog.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  products: Product[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const dataFromLocalStorage =
      this.localStorageService.getItemFromLocalStorage<Product[]>(
        LocalStorageConsts.PRODUCTS
      );
    if (dataFromLocalStorage) {
      this.products = dataFromLocalStorage;
    }

    this.translatePaginator();
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.localStorageService.setItemToLocalStorage(
      LocalStorageConsts.PRODUCTS,
      this.products
    );
    if (!this.products.length) {
      this.localStorageService.removeItemFromLocalStorage(
        LocalStorageConsts.PRODUCTS
      );
    }
  }

  openFiltersDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(RecipesFilterDialogComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
    });
  }

  translatePaginator() {
    this.paginator._intl.itemsPerPageLabel = 'Przepisy na stronie:';
    this.paginator._intl.nextPageLabel = 'Następna strona';
    this.paginator._intl.previousPageLabel = 'Poprzednia strona';
  }

  onChangedPage(pageData: PageEvent) {
    console.log('dupa');
  }
}
