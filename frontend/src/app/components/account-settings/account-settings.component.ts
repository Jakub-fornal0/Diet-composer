import { Component, OnInit } from '@angular/core';
import { UserConsts } from '../../consts/user-consts';
import { User } from '../../interfaces/user.model';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  userData: User = UserConsts;

  constructor() {}

  ngOnInit(): void {
    // MOCKUP USUNAC POTEM //
    this.userData = {
      id: 1,
      userImage: 'assets/user-default-image.png',
      userName: 'Andrzej',
      email: 'andrzej@gmail.com',
      age: 23,
      gender: 'mężczyzna',
      weight: 90,
      height: 188,
      dietType: 'Przyrost masy',
      BMI: 27.45,
      caloricDemand: 3000,
      proteinsDemand: 100,
      fatsDemand: 120,
      carbohydratesDemand: 130,
      recipes: [
        { id: 23, recipeImage: 'assets/zdj.jpg', recipeName: 'Makaron' },
        { id: 11, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: 12, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: 13, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: 14, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: 15, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: 111, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: 211, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: 511, recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
      ],
    };
    //_____________________//
  }
}
