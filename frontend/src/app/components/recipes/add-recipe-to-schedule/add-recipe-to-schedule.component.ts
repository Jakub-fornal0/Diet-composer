import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MealData, Schedule } from '../../../interfaces/schedule.model';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageConsts } from '../../../consts/localstorage-consts';
import { FormControl } from '@angular/forms';
import { ScheduleConsts } from '../../../consts/schedule-consts';

@Component({
  selector: 'app-add-recipe-to-schedule',
  templateUrl: './add-recipe-to-schedule.component.html',
  styleUrls: ['./add-recipe-to-schedule.component.scss'],
})
export class AddRecipeToScheduleComponent implements OnInit {
  typeOfMeal = new FormControl('');
  recipe?: MealData;
  schedule: Schedule = ScheduleConsts;
  typeOfMealIsChosen: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: MealData
  ) {
    this.recipe = data;
  }

  ngOnInit(): void {
    const dataFromLocalStorage =
      this.localStorageService.getItemFromLocalStorage<Schedule>(
        LocalStorageConsts.SCHEDULE
      );
    if (dataFromLocalStorage) {
      this.schedule = dataFromLocalStorage;
    }

    this.typeOfMeal.valueChanges.subscribe(() => {
      this.typeOfMealIsChosen = false;
      const type = this.typeOfMeal.value;
      if (type === 'breakfast' && this.schedule[type].recipeId) {
        this.typeOfMealIsChosen = true;
      }
      if (type === 'secondBreakfast' && this.schedule[type].recipeId) {
        this.typeOfMealIsChosen = true;
      }
      if (type === 'lunch' && this.schedule[type].recipeId) {
        this.typeOfMealIsChosen = true;
      }
      if (type === 'tea' && this.schedule[type].recipeId) {
        this.typeOfMealIsChosen = true;
      }
      if (type === 'dinner' && this.schedule[type].recipeId) {
        this.typeOfMealIsChosen = true;
      }
    });
  }

  checkTypeIsSelected(): boolean {
    if (this.typeOfMeal.value) {
      return true;
    }
    return false;
  }

  saveMealToSchedule() {
    const type = this.typeOfMeal.value;
    if (type === 'breakfast' && this.recipe) {
      this.schedule.breakfast = this.recipe;
    }
    if (type === 'secondBreakfast' && this.recipe) {
      this.schedule.secondBreakfast = this.recipe;
    }
    if (type === 'lunch' && this.recipe) {
      this.schedule.lunch = this.recipe;
    }
    if (type === 'tea' && this.recipe) {
      this.schedule.tea = this.recipe;
    }
    if (type === 'dinner' && this.recipe) {
      this.schedule.dinner = this.recipe;
    }

    this.localStorageService.setItemToLocalStorage(
      LocalStorageConsts.SCHEDULE,
      this.schedule
    );
  }
}
