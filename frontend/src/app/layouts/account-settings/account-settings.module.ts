import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../materialUI/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountSettingsComponent } from './account-settings.component';
import { SetUserImageDialogComponent } from './set-user-image-dialog/set-user-image-dialog.component';
import { SetBodyParametersDialogComponent } from './set-body-parameters-dialog/set-body-parameters-dialog.component';
import { DeleteRecipeDialogComponent } from './delete-recipe-dialog/delete-recipe-dialog.component';
import { RouterModule } from '@angular/router';

@NgModule({
  entryComponents: [AccountSettingsComponent],
  declarations: [
    AccountSettingsComponent,
    SetUserImageDialogComponent,
    SetBodyParametersDialogComponent,
    DeleteRecipeDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [AccountSettingsComponent],
})
export class AccountSettingsModule {}
