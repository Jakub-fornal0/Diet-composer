import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-recipe-dialog',
  templateUrl: './delete-recipe-dialog.component.html',
  styleUrls: ['./delete-recipe-dialog.component.scss'],
})
export class DeleteRecipeDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  deleteRecipe() {
    this.dialogRef.close(true);
  }
}
