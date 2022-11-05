import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from './../../interfaces/product.model';
import { Recipe } from './../../interfaces/recipe.model';
import { MatDialog } from '@angular/material/dialog';
import { RecipesFilterDialogComponent } from './recipes-filter-dialog/recipes-filter-dialog.component';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  authListenerSubs?: Subscription;
  userIsAuthenticated: boolean = true;
  products: Product[] = [];
  currentPage: number = 1;
  countOfRecipes: number = 0;
  countOfPages: number = 0;

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

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.userIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.userIsAuthenticated = isAuth;
      });

    if (this.userIsAuthenticated) {
      this.productService.getAllUserProducts().subscribe((res) => {
        res.Products.forEach((product: any) => {
          this.products.push({
            id: product.product.id,
            name: product.product.name,
            measureUnit: product.product.measureUnit,
            quantity: product.quantity,
          });
        });
      });
    }

    //WYWOLAC ENDPOINT KTORY ZWRACA LICZBE PASUJACYCH PRZEPISOW
    this.countOfRecipes = 4570;
    this.countOfPages = Math.ceil(this.countOfRecipes / 12);
    //JAK BEDZIE BACKEND TO WYWOLAC ENDPOINT PO PRZEPISY Z CURRENTPAGE
  }

  deleteProduct(index: number) {
    this.productService
      .deleteUserProduct(this.products[index].id!)
      .subscribe(() => {
        this.products.splice(index, 1);
      });
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

  getRecipes(action: string) {
    if (action === 'next') {
      this.currentPage++;
    } else {
      this.currentPage--;
    }
    //TU WYWOLAC ENDPOINT DLA POBRANIA PRZEPISOW NA PAGE
  }

  setAsCurrentPage(numberOfPages: number) {
    this.currentPage = numberOfPages;
    //TU WYWOLAC ENDPOINT DLA POBRANIA PRZEPISOW NA PAGE
  }
}
