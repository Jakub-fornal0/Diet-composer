import { Product } from './product.model';

export interface Recipe {
  id?: number;
  image: string;
  name: string;
  description: string;
  cookingTime: string;
  portions: number;
}

export interface RecipeDetail {
  id?: number;
  image: string;
  name: string;
  category: string;
  cookingTime: string;
  portions: number;
  products: Product[];
  recipe: string[];
  author?: string;
  calories: number;
  fats: number;
  proteins: number;
  carbohydrates: number;
}
