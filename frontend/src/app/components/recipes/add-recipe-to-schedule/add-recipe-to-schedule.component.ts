import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedule } from '../../../interfaces/schedule.model';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageConsts } from '../../../consts/localstorage-consts';
import { FormControl } from '@angular/forms';
import { ScheduleConsts } from '../../../consts/schedule-consts';
import { RecipeDetail } from '../../../interfaces/recipe.model';

@Component({
  selector: 'app-add-recipe-to-schedule',
  templateUrl: './add-recipe-to-schedule.component.html',
  styleUrls: ['./add-recipe-to-schedule.component.scss'],
})
export class AddRecipeToScheduleComponent implements OnInit {
  public typeOfMeal = new FormControl('');
  public recipe?: RecipeDetail;
  public schedule: Schedule = ScheduleConsts;
  public typeOfMealIsChosen: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddRecipeToScheduleComponent>,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDetail
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
      if (
        (type === 'breakfast' ||
          type === 'secondBreakfast' ||
          type === 'lunch' ||
          type === 'tea' ||
          type === 'dinner') &&
        this.schedule[type].recipeId
      ) {
        this.typeOfMealIsChosen = true;
      }
    });
  }

  public checkTypeIsSelected(): boolean {
    if (this.typeOfMeal.value) {
      return true;
    }
    return false;
  }

  public saveMealToSchedule(): void {
    const type = this.typeOfMeal.value;
    if (
      (type === 'breakfast' ||
        type === 'secondBreakfast' ||
        type === 'lunch' ||
        type === 'tea' ||
        type === 'dinner') &&
      this.recipe
    ) {
      this.schedule[type].recipeId = this.recipe.id;
      this.schedule[type].recipeName = this.recipe.name;
      this.schedule[type].recipeImage = this.recipe.image;
      this.schedule[type].calories = this.recipe.calories;
      this.schedule[type].fats = this.recipe.fats;
      this.schedule[type].proteins = this.recipe.proteins;
      this.schedule[type].carbohydrates = this.recipe.carbohydrates;
    }

    this.localStorageService.setItemToLocalStorage(
      LocalStorageConsts.SCHEDULE,
      this.schedule
    );

    this.dialogRef.close(true);
  }
}
