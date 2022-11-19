import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageConsts } from '../../consts/localstorage-consts';
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
import { AccountService } from 'src/app/services/account.service';

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
    private localStorageService: LocalStorageService,
    private accountService: AccountService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.getUserNutrientsDemand();
    this.getScheduleData();
    this.clearScheduleDetails();
    this.setEatenNutrients();
    this.setSnacks();
  }

  private getUserNutrientsDemand(): void {
    this.accountService.getUserData().subscribe((res) => {
      this.scheduleDetails.totalCalories = res.user.caloricDemand;
      this.scheduleDetails.totalCarbohydrates = res.user.carbohydratesDemand;
      this.scheduleDetails.totalProteins = res.user.proteinsDemand;
      this.scheduleDetails.totalFats = res.user.fatsDemand;
    });
  }

  private getScheduleData(): void {
    //PRZEROBIC POTEM NA POBIERANIE Z SERWERA
    const dataFromLocalStorage =
      this.localStorageService.getItemFromLocalStorage<Schedule>(
        LocalStorageConsts.SCHEDULE
      );
    if (dataFromLocalStorage) {
      this.schedule = dataFromLocalStorage;
    }
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
  }

  private setSnacks(): void {
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
      this.schedule[mealType].eaten = !this.schedule[mealType].eaten;
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

      this.localStorageService.setItemToLocalStorage(
        LocalStorageConsts.SCHEDULE,
        this.schedule
      );
    }
  }

  public deleteMealFromSchedule(mealType: string): void {
    if (
      mealType === 'breakfast' ||
      mealType === 'secondBreakfast' ||
      mealType === 'lunch' ||
      mealType === 'tea' ||
      mealType === 'dinner'
    ) {
      if (this.schedule[mealType].eaten) {
        this.scheduleDetails.eatenCalories -= this.schedule[mealType].calories;
        this.scheduleDetails.eatenCarbohydrates -=
          this.schedule[mealType].carbohydrates;
        this.scheduleDetails.eatenProteins -= this.schedule[mealType].proteins;
        this.scheduleDetails.eatenFats -= this.schedule[mealType].fats;
      }

      this.schedule[mealType].recipeId = '';
      this.schedule[mealType].recipeName = '';
      this.schedule[mealType].recipeImage = '';
      this.schedule[mealType].proteins = 0;
      this.schedule[mealType].fats = 0;
      this.schedule[mealType].eaten = false;
      this.schedule[mealType].carbohydrates = 0;
      this.schedule[mealType].calories = 0;

      this.localStorageService.setItemToLocalStorage(
        LocalStorageConsts.SCHEDULE,
        this.schedule
      );
    }
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
          this.addSnack(snack);
          this.schedule.snacks.push(snack);
          this.localStorageService.setItemToLocalStorage(
            LocalStorageConsts.SCHEDULE,
            this.schedule
          );
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
    this.scheduleDetails.eatenCalories -= this.schedule.snacks[index].calories;
    this.scheduleDetails.eatenCarbohydrates -=
      this.schedule.snacks[index].carbohydrates;
    this.scheduleDetails.eatenProteins -= this.schedule.snacks[index].proteins;
    this.scheduleDetails.eatenFats -= this.schedule.snacks[index].fats;

    this.schedule.snacks.splice(index, 1);
    this.localStorageService.setItemToLocalStorage(
      LocalStorageConsts.SCHEDULE,
      this.schedule
    );
  }

  public clearSchedule(): void {
    this.localStorageService.removeItemFromLocalStorage(
      LocalStorageConsts.SCHEDULE
    );
    window.location.reload();
  }
}
