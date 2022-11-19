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
  dietType: string;
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
  category?: string;
  dietType?: string;
}

export interface RecipeAddData {
  id?: string;
  name: string;
  description: string;
  cookingTime: number;
  portions: number;
  level: string;
  category: string;
  dietType: string;
  author: string;
  calories: number;
  fats: number;
  proteins: number;
  carbohydrates: number;
  products: string;
  steps: string;
}

export interface RecipeStep {
  id?: number;
  name: string;
}
