import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-set-user-image-dialog',
  templateUrl: './set-user-image-dialog.component.html',
  styleUrls: ['./set-user-image-dialog.component.scss'],
})
export class SetUserImageDialogComponent implements OnInit {
  public imagePreview!: string;
  public userImageFormGroup = this.formBuilder.group({
    userImage: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SetUserImageDialogComponent>
  ) {}

  ngOnInit(): void {}

  public processFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files;
    this.userImageFormGroup.get('userImage')?.setValue(file![0]);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file![0]);
  }

  public saveUserImage(): void {
    this.dialogRef.close({
      file: this.userImageFormGroup.value,
      preview: this.imagePreview,
    });
  }
}
