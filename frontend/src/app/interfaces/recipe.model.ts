import { Product } from './product.model';

export interface Recipe {
  id?: string;
  image: string;
  name: string;
  description: string;
  cookingTime: number;
  portions: number;
  level: string;
  category: string;
}

export interface RecipeDetail {
  id?: string;
  image: string;
  name: string;
  cookingTime: number;
  portions: number;
  level: string;
  products: Product[];
  recipeStep: RecipeStep[];
  author?: string;
  calories: number;
  fats: number;
  proteins: number;
  carbohydrates: number;
}

export interface RecipeStep {
  id?: string;
  stepName: string;
}
