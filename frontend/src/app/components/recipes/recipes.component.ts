import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from './../../interfaces/product.model';
import { Recipe } from './../../interfaces/recipe.model';
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

  // MOCKUP USUNAC POTEM//
  recipes: Recipe[] = [
    {
      id: '1',
      image: 'assets/zdj.jpg',
      name: '1 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '2',
      image: 'assets/zdj.jpg',
      name: '2 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Średni',
      category: 'obiad',
    },
    {
      id: '3',
      image: 'assets/zdj.jpg',
      name: '3 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Trudny',
      category: 'obiad',
    },
    {
      id: '4',
      image: 'assets/zdj.jpg',
      name: '4 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '5',
      image: 'assets/zdj.jpg',
      name: '5 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '6',
      image: 'assets/zdj.jpg',
      name: '6 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '7',
      image: 'assets/zdj.jpg',
      name: '7 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '8',
      image: 'assets/zdj.jpg',
      name: '8 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '9',
      image: 'assets/zdj.jpg',
      name: '9 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '10',
      image: 'assets/zdj.jpg',
      name: '10 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '11',
      image: 'assets/zdj.jpg',
      name: '11 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 4444,
      level: 'Łatwy',
      category: 'obiad',
    },
    {
      id: '12',
      image: 'assets/zdj.jpg',
      name: '12 Przepis Przepis Przepis',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      cookingTime: 45,
      portions: 111,
      level: 'Łatwy',
      category: 'obiad',
    },
  ];
  // ___________________ //

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
    console.log('');
  }
}
