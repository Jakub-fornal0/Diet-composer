import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserConsts } from '../../consts/user-consts';
import { User } from '../../interfaces/user.model';
import { SetBodyParametersDialogComponent } from './set-body-parameters-dialog/set-body-parameters-dialog.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  userData: User = UserConsts;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // MOCKUP USUNAC POTEM //
    this.userData = {
      id: 1,
      userImage: 'assets/user-default-image.png',
      userName: 'Andrzej',
      email: 'andrzej@gmail.com',
      age: 0,
      gender: '-',
      weight: 0,
      height: 0,
      dietType: '-',
      BMI: 0,
      caloricDemand: 0,
      proteinsDemand: 0,
      fatsDemand: 0,
      carbohydratesDemand: 0,
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

  openSetBodyParametersDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog
      .open(SetBodyParametersDialogComponent, {
        width: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          age: this.userData.age,
          gender: this.userData.gender,
          weight: this.userData.weight,
          height: this.userData.height,
          dietType: this.userData.dietType,
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.userData.age = data.age;
          this.userData.gender = data.gender;
          this.userData.weight = data.weight;
          this.userData.height = data.height;
          this.userData.dietType = data.dietType;
        }

        //TUTAJ WYWOLAC HTTP ZAPISAC DANE I ODEBRAC PARAMETRY ZAPOTREBOWANIA KTORE PRZYPISAC
      });
  }
}
