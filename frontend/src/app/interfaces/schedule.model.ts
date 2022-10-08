export interface MealData {
  recipeId?: string;
  recipeName: string;
  recipeImage: string;
  calories: number;
  fats: number;
  proteins: number;
  carbohydrates: number;
  eaten: boolean;
}

export interface Schedule {
  breakfast: MealData;
  secondBreakfast: MealData;
  lunch: MealData;
  tea: MealData;
  dinner: MealData;
}

export interface ScheduleDetails {
  totalCalories: number;
  eatenCalories: number;
  totalCarbohydrates: number;
  eatenCarbohydrates: number;
  totalProteins: number;
  eatenProteins: number;
  totalFats: number;
  eatenFats: number;
}
