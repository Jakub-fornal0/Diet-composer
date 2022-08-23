import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageConsts } from '../../consts/localstorage-consts';
import {
  ScheduleConsts,
  ScheduleDetailsConsts,
} from '../../consts/schedule-consts';
import { Schedule, ScheduleDetails } from '../../interfaces/schedule.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  time = new Date();
  date = new Date().toLocaleDateString('pl', {
    year: 'numeric',
    day: '2-digit',
    month: '2-digit',
  });

  scheduleDetails: ScheduleDetails = ScheduleDetailsConsts;
  schedule: Schedule = ScheduleConsts;
  typesOfMealPL: string[] = [
    'Śniadanie',
    'II śniadanie',
    'Obiad',
    'Podwieczorek',
    'Kolacja',
  ];
  typesOfMealENG: string[] = [
    'breakfast',
    'secondBreakfast',
    'lunch',
    'tea',
    'dinner',
  ];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const dataFromLocalStorage =
      this.localStorageService.getItemFromLocalStorage<Schedule>(
        LocalStorageConsts.SCHEDULE
      );
    if (dataFromLocalStorage) {
      this.schedule = dataFromLocalStorage;
    }

    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.clearScheduleDetails();

    Object.entries(this.schedule).forEach(([key, val]) => {
      if (
        key === 'breakfast' ||
        key === 'secondBreakfast' ||
        key === 'lunch' ||
        key === 'tea' ||
        key === 'dinner'
      ) {
        this.scheduleDetails.totalCalories += this.schedule[key].calories;
        this.scheduleDetails.totalCarbohydrates +=
          this.schedule[key].carbohydrates;
        this.scheduleDetails.totalProteins += this.schedule[key].proteins;
        this.scheduleDetails.totalFats += this.schedule[key].fats;

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

  setMealAsEaten(mealType: string) {
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

  deleteMealFromSchedule(mealType: string) {
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

      this.scheduleDetails.totalCalories -= this.schedule[mealType].calories;
      this.scheduleDetails.totalCarbohydrates -=
        this.schedule[mealType].carbohydrates;
      this.scheduleDetails.totalProteins -= this.schedule[mealType].proteins;
      this.scheduleDetails.totalFats -= this.schedule[mealType].fats;

      this.schedule[mealType].recipeId = 0;
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

  clearScheduleDetails() {
    this.scheduleDetails.totalCalories = 0;
    this.scheduleDetails.totalCarbohydrates = 0;
    this.scheduleDetails.totalProteins = 0;
    this.scheduleDetails.totalFats = 0;
    this.scheduleDetails.eatenCalories = 0;
    this.scheduleDetails.eatenCarbohydrates = 0;
    this.scheduleDetails.eatenProteins = 0;
    this.scheduleDetails.eatenFats = 0;
  }
}
