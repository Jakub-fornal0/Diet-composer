import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-all-products-dialog',
  templateUrl: './delete-all-products-dialog.component.html',
  styleUrls: ['./delete-all-products-dialog.component.scss'],
})
export class DeleteAllProductsDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteAllProductsDialogComponent>
  ) {}

  ngOnInit(): void {}

  public deleteAllProducts(): void {
    this.dialogRef.close(true);
  }
}
