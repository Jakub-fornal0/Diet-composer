export interface User {
  id?: string;
  userImage: string;
  userName: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  dietType: string;
  physicalActivity: string;
  BMI: number;
  caloricDemand: number;
  proteinsDemand: number;
  fatsDemand: number;
  carbohydratesDemand: number;
  recipes: UserRecipe[];
}

export interface UserRecipe {
  id?: string;
  recipeImage: string;
  recipeName: string;
}
