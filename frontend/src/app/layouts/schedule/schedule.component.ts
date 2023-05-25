import { Component, OnInit } from '@angular/core';
import {
  ScheduleConsts,
  ScheduleDetailsConsts,
} from '../../consts/schedule-consts';
import {
  Schedule,
  ScheduleDetails,
  SnackMealData,
} from '../../interfaces/schedule.model';
import { MatDialog } from '@angular/material/dialog';
import { AddOtherMealToScheduleComponent } from './add-other-meal-to-schedule/add-other-meal-to-schedule.component';
import { AccountService } from '../../services/account.service';
import { DeleteMealDialogComponent } from './delete-meal-dialog/delete-meal-dialog.component';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  public time = new Date();
  public date = new Date().toLocaleDateString('pl', {
    year: 'numeric',
    day: '2-digit',
    month: '2-digit',
  });

  public scheduleDetails: ScheduleDetails = ScheduleDetailsConsts;
  public schedule: Schedule = ScheduleConsts;
  public typesOfMealPL: string[] = [
    'Śniadanie',
    'II śniadanie',
    'Obiad',
    'Podwieczorek',
    'Kolacja',
  ];
  public typesOfMealENG: string[] = [
    'breakfast',
    'secondBreakfast',
    'lunch',
    'tea',
    'dinner',
  ];

  constructor(
    private accountService: AccountService,
    private scheduleService: ScheduleService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.getUserNutrientsDemand();
    this.getSchedule();
    this.clearScheduleDetails();

    setTimeout(() => {
      this.setEatenNutrients();
    }, 100);
  }

  private getUserNutrientsDemand(): void {
    this.accountService.getUserData().subscribe((res) => {
      this.scheduleDetails.totalCalories = res.user.caloricDemand;
      this.scheduleDetails.totalCarbohydrates = res.user.carbohydratesDemand;
      this.scheduleDetails.totalProteins = res.user.proteinsDemand;
      this.scheduleDetails.totalFats = res.user.fatsDemand;
    });
  }

  private getSchedule(): void {
    this.scheduleService.getSchedule().subscribe((res) => {
      this.schedule = res;
    });
  }

  private setEatenNutrients(): void {
    Object.entries(this.schedule).forEach(([key, val]) => {
      if (
        key === 'breakfast' ||
        key === 'secondBreakfast' ||
        key === 'lunch' ||
        key === 'tea' ||
        key === 'dinner'
      ) {
        if (this.schedule[key].eaten) {
          this.scheduleDetails.eatenCalories += this.schedule[key].calories;
          this.scheduleDetails.eatenCarbohydrates +=
            this.schedule[key].carbohydrates;
          this.scheduleDetails.eatenProteins += this.schedule[key].proteins;
          this.scheduleDetails.eatenFats += this.schedule[key].fats;
        }
      }
    });

    this.schedule.snacks.forEach((snack) => {
      this.addSnack(snack);
    });
  }

  public setMealAsEaten(mealType: string): void {
    if (
      mealType === 'breakfast' ||
      mealType === 'secondBreakfast' ||
      mealType === 'lunch' ||
      mealType === 'tea' ||
      mealType === 'dinner'
    ) {
      this.schedule[mealType].eaten =
        this.schedule[mealType].eaten === 1 ? 0 : 1;
      if (this.schedule[mealType].eaten) {
        this.scheduleDetails.eatenCalories += this.schedule[mealType].calories;
        this.scheduleDetails.eatenCarbohydrates +=
          this.schedule[mealType].carbohydrates;
        this.scheduleDetails.eatenProteins += this.schedule[mealType].proteins;
        this.scheduleDetails.eatenFats += this.schedule[mealType].fats;
      } else {
        this.scheduleDetails.eatenCalories -= this.schedule[mealType].calories;
        this.scheduleDetails.eatenCarbohydrates -=
          this.schedule[mealType].carbohydrates;
        this.scheduleDetails.eatenProteins -= this.schedule[mealType].proteins;
        this.scheduleDetails.eatenFats -= this.schedule[mealType].fats;
      }

      this.scheduleService
        .updateMealStatus(this.schedule[mealType].recipeId!)
        .subscribe((res) => {});
    }
  }

  public deleteMealFromSchedule(mealType: string): void {
    this.dialog
      .open(DeleteMealDialogComponent, {
        width: '500px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: 'one',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          if (
            mealType === 'breakfast' ||
            mealType === 'secondBreakfast' ||
            mealType === 'lunch' ||
            mealType === 'tea' ||
            mealType === 'dinner'
          ) {
            if (this.schedule[mealType].eaten) {
              this.scheduleDetails.eatenCalories -=
                this.schedule[mealType].calories;
              this.scheduleDetails.eatenCarbohydrates -=
                this.schedule[mealType].carbohydrates;
              this.scheduleDetails.eatenProteins -=
                this.schedule[mealType].proteins;
              this.scheduleDetails.eatenFats -= this.schedule[mealType].fats;
            }

            this.scheduleService
              .removeRecipeFromSchedule(this.schedule[mealType].recipeId!)
              .subscribe((res) => {
                this.schedule[mealType].recipeId = '';
                this.schedule[mealType].recipeName = '';
                this.schedule[mealType].recipeImage = '';
                this.schedule[mealType].proteins = 0;
                this.schedule[mealType].fats = 0;
                this.schedule[mealType].eaten = 0;
                this.schedule[mealType].carbohydrates = 0;
                this.schedule[mealType].calories = 0;
              });
          }
        }
      });
  }

  public clearScheduleDetails(): void {
    this.scheduleDetails.eatenCalories = 0;
    this.scheduleDetails.eatenCarbohydrates = 0;
    this.scheduleDetails.eatenProteins = 0;
    this.scheduleDetails.eatenFats = 0;
  }

  public openAddOtherMealDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog
      .open(AddOtherMealToScheduleComponent, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
      })
      .afterClosed()
      .subscribe((snack: SnackMealData) => {
        if (snack) {
          this.scheduleService.addSnack(snack).subscribe((res) => {
            this.schedule.snacks.push(snack);
            this.addSnack(snack);
          });
        }
      });
  }

  public addSnack(snack: SnackMealData): void {
    this.scheduleDetails.eatenCalories += snack.calories;
    this.scheduleDetails.eatenCarbohydrates += snack.carbohydrates;
    this.scheduleDetails.eatenProteins += snack.proteins;
    this.scheduleDetails.eatenFats += snack.fats;
  }

  public deleteSnack(index: number): void {
    const id = this.schedule.snacks[index].id;
    this.scheduleDetails.eatenCalories -= this.schedule.snacks[index].calories;
    this.scheduleDetails.eatenCarbohydrates -=
      this.schedule.snacks[index].carbohydrates;
    this.scheduleDetails.eatenProteins -= this.schedule.snacks[index].proteins;
    this.scheduleDetails.eatenFats -= this.schedule.snacks[index].fats;

    if (id) {
      this.scheduleService.removeSnack(id).subscribe((res) => {
        this.schedule.snacks.splice(index, 1);
      });
    }
  }

  public clearSchedule(): void {
    this.dialog
      .open(DeleteMealDialogComponent, {
        width: '500px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: 'all',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.scheduleService.clearSchedule().subscribe((res) => {
            window.location.reload();
          });
        }
      });
  }
}
