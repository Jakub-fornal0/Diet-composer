import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../materialUI/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule.component';
import { DeleteMealDialogComponent } from './delete-meal-dialog/delete-meal-dialog.component';
import { AddOtherMealToScheduleComponent } from './add-other-meal-to-schedule/add-other-meal-to-schedule.component';
import { RouterModule } from '@angular/router';

@NgModule({
  entryComponents: [ScheduleComponent],
  declarations: [
    ScheduleComponent,
    DeleteMealDialogComponent,
    AddOtherMealToScheduleComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [ScheduleComponent],
})
export class ScheduleModule {}
