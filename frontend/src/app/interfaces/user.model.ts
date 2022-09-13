export interface User {
  id?: number;
  userImage: String;
  userName: String;
  email: String;
  age: number;
  gender: String;
  weight: number;
  height: number;
  dietType: String;
  BMI: number;
  caloricDemand: number;
  proteinsDemand: number;
  fatsDemand: number;
  carbohydratesDemand: number;
  recipes: UserRecipe[];
}

export interface UserRecipe {
  id?: number;
  recipeImage: String;
  recipeName: String;
}
