import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/services/account.service';
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

  constructor(
    private dialog: MatDialog,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // MOCKUP USUNAC POTEM //
    this.userData = {
      id: 'id445455',
      userImage: 'assets/user-default-image.png',
      userName: 'Andrzej',
      email: 'andrzej@gmail.com',
      age: 0,
      gender: '-',
      weight: 0,
      height: 0,
      dietType: '-',
      physicalActivity: '-',
      BMI: 0,
      caloricDemand: 0,
      proteinsDemand: 0,
      fatsDemand: 0,
      carbohydratesDemand: 0,
      recipes: [
        { id: '23', recipeImage: 'assets/zdj.jpg', recipeName: 'Makaron' },
        { id: '11', recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: '12', recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        {
          id: '13',
          recipeImage: 'assets/zdj.jpg',
          recipeName: 'Schabowe dddddd c cccccc vvvv ddfddddfdfdfdfd sss',
        },
        { id: '14', recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe ' },
        { id: '15', recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: '111', recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: '211', recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
        { id: '511', recipeImage: 'assets/zdj.jpg', recipeName: 'Schabowe' },
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
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          age: this.userData.age,
          gender: this.userData.gender,
          weight: this.userData.weight,
          height: this.userData.height,
          dietType: this.userData.dietType,
          physicalActivity: this.userData.physicalActivity,
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
          this.userData.physicalActivity = data.physicalActivity;
        }

        this.accountService
          .calculateUserDemands({ ...data, id: this.userData.id })
          .subscribe((res) => {
            this.userData.BMI = res.BMI;
            this.userData.caloricDemand = res.caloricDemand;
            this.userData.fatsDemand = res.fatsDemand;
            this.userData.carbohydratesDemand = res.carbohydratesDemand;
            this.userData.proteinsDemand = res.proteinsDemand;
          });
      });
  }
}
