export interface User {
  id?: string;
  userImage: string;
  userName: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  dietPurpose: string;
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
  image: string;
  name: string;
}

export interface UserProfile {
  id: string;
  iat: number;
  exp: number;
}
