import { UserConsts } from './../../consts/user-consts';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/services/account.service';
import { User } from '../../interfaces/user.model';
import { SetBodyParametersDialogComponent } from './set-body-parameters-dialog/set-body-parameters-dialog.component';
import { SetUserImageDialogComponent } from './set-user-image-dialog/set-user-image-dialog.component';

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
    this.accountService.getUserData().subscribe((res) => {
      this.userData = res.user;
      this.userData.recipes = res.recipes;
    });
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
          dietPurpose: this.userData.dietPurpose,
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
          this.userData.dietPurpose = data.dietPurpose;
          this.userData.physicalActivity = data.physicalActivity;

          this.accountService.calculateUserDemands(data).subscribe((res) => {
            this.userData.BMI = res.BMI;
            this.userData.caloricDemand = res.caloricDemand;
            this.userData.fatsDemand = res.fatsDemand;
            this.userData.carbohydratesDemand = res.carbohydratesDemand;
            this.userData.proteinsDemand = res.proteinsDemand;
          });
        }
      });
  }

  openSetUserImageDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog
      .open(SetUserImageDialogComponent, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.accountService
            .setUserImage(data.file.userImage)
            .subscribe((res) => {
              this.userData.userImage = data.preview;
            });
        }
      });
  }
}
