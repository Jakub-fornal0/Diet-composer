export interface MealData {
  recipeId?: number;
  recipeName: string;
  recipeImage: string;
  calories: number;
  fats: number;
  proteins: number;
  carbohydrates: number;
}

export interface Schedule {
  breakfast: MealData;
  secondBreakfast: MealData;
  lunch: MealData;
  tea: MealData;
  dinner: MealData;
}
