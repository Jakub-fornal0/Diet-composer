import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-meal-dialog',
  templateUrl: './delete-meal-dialog.component.html',
  styleUrls: ['./delete-meal-dialog.component.scss'],
})
export class DeleteMealDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteMealDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {}

  public deleteRecipe(): void {
    this.dialogRef.close(true);
  }
}
