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
  public choosenFilters: string = 'Nie wybrano filtrów.';
  public recipes: Recipe[] = [];

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkUserIsAuth();

    if (this.userIsAuthenticated) {
      this.getUserProducts();
    }

    this.getRecipes();

    //WYWOLAC ENDPOINT KTORY ZWRACA LICZBE PASUJACYCH PRZEPISOW
    this.countOfRecipes = 4570;
    this.countOfPages = Math.ceil(this.countOfRecipes / 12);
    //JAK BEDZIE BACKEND TO WYWOLAC ENDPOINT PO PRZEPISY Z CURRENTPAGE
  }

  private getRecipes(filters?: string): void {
    this.dataIsInitialized = false;

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

    if (filters) {
      params += filters;
    }

    console.log(params);

    this.recipeService.getRecipes(params).subscribe((res) => {
      this.recipes = res.Recipes;
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
            this.choosenFilters = filters.filtersToDisplay;
            this.getRecipes(filters.filtersString);
          }
        }
      );
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
