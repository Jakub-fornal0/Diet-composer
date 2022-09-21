import { Product } from './product.model';

export interface Recipe {
  id?: number;
  image: string;
  name: string;
  description: string;
  cookingTime: number;
  portions: number;
  category: string;
}

export interface RecipeDetail {
  id?: number;
  image: string;
  name: string;
  cookingTime: number;
  portions: number;
  products: Product[];
  recipeStep: RecipeStep[];
  author?: string;
  calories: number;
  fats: number;
  proteins: number;
  carbohydrates: number;
}

export interface RecipeStep {
  id?: number;
  stepName: String;
}
