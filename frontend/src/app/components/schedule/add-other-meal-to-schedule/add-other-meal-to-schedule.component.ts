import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-other-meal-to-schedule',
  templateUrl: './add-other-meal-to-schedule.component.html',
  styleUrls: ['./add-other-meal-to-schedule.component.scss'],
})
export class AddOtherMealToScheduleComponent implements OnInit {
  public snackMealForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddOtherMealToScheduleComponent>
  ) {
    this.snackMealForm = this.formBuilder.group({
      snackName: ['', [Validators.required]],
      calories: ['', [Validators.required]],
      fats: ['', [Validators.required]],
      carbohydrates: ['', [Validators.required]],
      proteins: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  public saveOtherMeal(): void {
    this.dialogRef.close(this.snackMealForm.value);
  }
}
