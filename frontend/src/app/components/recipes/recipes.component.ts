import { SessionStorageService } from './../../services/session-storage.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { Component, OnInit } from '@angular/core';
import { Product } from './../../interfaces/product.model';
import { Recipe } from './../../interfaces/recipe.model';
import { MatDialog } from '@angular/material/dialog';
import { RecipesFilterDialogComponent } from './recipes-filter-dialog/recipes-filter-dialog.component';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SessionStorageConsts } from '../../consts/sessionstorage-consts';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  public authListenerSubs?: Subscription;
  public userIsAuthenticated: boolean = true;
  public dataIsInitialized: boolean = false;
  public products: Product[] = [];
  public currentPage: number = 1;
  public countOfRecipes: number = 0;
  public countOfPages: number = 0;
  public filtersToDisplay: string = 'Nie wybrano filtrów.';
  public filters: string = '';
  public recipes: Recipe[] = [];

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.checkUserIsAuth();

    if (this.userIsAuthenticated) {
      this.getUserProducts();
    }

    this.getRecipes();
  }

  private getRecipes(): void {
    this.dataIsInitialized = false;
    this.filters = '';
    this.filtersToDisplay = 'Nie wybrano filtrów.';

    let filtersSession: string =
      this.sessionStorageService.getItemFromSessionStorage(
        SessionStorageConsts.FILTERS
      ) || '';

    let filtersToDisplaySession: string =
      this.sessionStorageService.getItemFromSessionStorage(
        SessionStorageConsts.FILTERSTODISPLAY
      ) || 'Nie wybrano filtrów.';

    if (filtersSession && filtersToDisplaySession) {
      this.filters = filtersSession;
      this.filtersToDisplay = filtersToDisplaySession;
    }

    this.router.navigate(['/recipes'], {
      queryParams: { page: this.currentPage },
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('page')) {
        this.currentPage = Number(paramMap.get('page'));
      }
    });

    let params: string = '?page=';
    params += this.currentPage;

    //if filters exist then add to params string
    if (this.filters) {
      params += this.filters;
    }

    this.recipeService.getRecipes(params).subscribe((res) => {
      this.recipes = res.Recipes;
      this.countOfRecipes = res.NumberOfRecipes;
      this.countOfPages = Math.ceil(this.countOfRecipes / 12);
      this.dataIsInitialized = true;
    });
  }

  private checkUserIsAuth(): void {
    this.userIsAuthenticated = this.authService.userIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.userIsAuthenticated = isAuth;
      });
  }

  private getUserProducts(): void {
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

  public deleteProduct(index: number): void {
    this.productService
      .deleteUserProduct(this.products[index].id!)
      .subscribe(() => {
        this.products.splice(index, 1);
        this.getRecipes();
      });
  }

  public openFiltersDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog
      .open(RecipesFilterDialogComponent, {
        width: '900px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (filters: { filtersString: string; filtersToDisplay: string }) => {
          if (filters.filtersString && filters.filtersToDisplay) {
            this.filtersToDisplay = filters.filtersToDisplay;
            this.filters = filters.filtersString;

            this.sessionStorageService.setItemToSessionStorage(
              SessionStorageConsts.FILTERS,
              this.filters
            );
            this.sessionStorageService.setItemToSessionStorage(
              SessionStorageConsts.FILTERSTODISPLAY,
              this.filtersToDisplay
            );

            this.getRecipes();
          }
        }
      );
  }

  public removeFilters(): void {
    this.sessionStorageService.removeItemFromSessionStorage(
      SessionStorageConsts.FILTERS
    );
    this.sessionStorageService.removeItemFromSessionStorage(
      SessionStorageConsts.FILTERSTODISPLAY
    );
    this.getRecipes();
  }

  public getRecipesForPage(action: string): void {
    if (action === 'next') {
      this.currentPage++;
    } else {
      this.currentPage--;
    }

    this.getRecipes();
  }

  public setAsCurrentPage(numberOfSelectedPage: number): void {
    this.currentPage = numberOfSelectedPage;
    this.getRecipes();
  }
}
